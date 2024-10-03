import {ref} from 'vue'
import {WebMidi} from 'webmidi'

import {Mnml} from './mnml'
import {MNML_STATE} from './mnml-const'

export const mnmlState = ref(MNML_STATE.UNKNOWN)

function updateMnmlState(mnmlInstance: Mnml): void {
    let newState
    // @ts-ignore
    if (!navigator.requestMIDIAccess) {
        newState = MNML_STATE.MIDI_UNAVAILABLE
    }
    else if (!WebMidi.enabled) {
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
    mnmlState.value = newState || MNML_STATE.UNKNOWN
}

const mnmlInstance = ref<Mnml>()

export async function createMnml(): Promise<void> {
    if (!WebMidi.enabled) {
        await WebMidi.enable()
    }

    mnmlInstance.value = new Mnml()
    updateMnmlState(mnmlInstance.value)
}

export function useMnml() {
    return {
        mnml: mnmlInstance.value as Mnml,
        state: mnmlState,
    }
}
