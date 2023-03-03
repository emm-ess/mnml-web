import type {Plugin} from 'vue'
import {ref} from 'vue'
import {WebMidi} from 'webmidi'

import {Mnml} from './mnml'
import {MNML_STATE} from './mnml-const'

export const mnmlState = ref(MNML_STATE.UNKNOWN)

function updateMnmlState(mnmlInstance: Mnml): void {
    let newState = MNML_STATE.UNKNOWN
    // @ts-ignore
    if (!navigator.requestMIDIAccess) {
        newState = MNML_STATE.MIDI_UNAVAILABLE
    }
    if (!WebMidi.enabled) {
        newState = MNML_STATE.MIDI_NOT_ENABLED
    }
    else if (WebMidi.outputs.length === 0) {
        newState = MNML_STATE.NO_OUTPUT_AVAILABLE
    }
    else if (mnmlInstance.output) {
        newState = MNML_STATE.READY
    }
    else {
        newState = MNML_STATE.NO_OUTPUT_SELECTED
    }
    mnmlState.value = newState
}

export async function createMnml(): Promise<Plugin> {
    if (!WebMidi.enabled) {
        await WebMidi.enable()
    }

    const mnmlInstance = new Mnml()
    updateMnmlState(mnmlInstance)

    return {
        install(app) {
            // app.config.globalProperties.$mnmlState = mnmlState
            Object.defineProperty(app.config.globalProperties, '$mnmlState', {
                get() {
                    return mnmlState.value
                },
            })
            // @ts-ignore
            app.config.globalProperties.$mnml = ref(mnmlInstance).value
        },
    }
}
