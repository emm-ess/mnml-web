import {ref} from 'vue'
import {WebMidi} from 'webmidi'

import {Mnml} from './mnml'
import {MNML_STATE} from './mnml-const'

const mnmlState = ref(MNML_STATE.UNKNOWN)

let mnmlInstance: Mnml | null = null

export async function createMnml(): Promise<void> {
    if (!WebMidi.enabled) {
        await WebMidi.enable()
    }

    mnmlInstance = new Mnml()
    mnmlState.value = mnmlInstance.state
    mnmlInstance.on('stateUpdate', (state) => {
        mnmlState.value = state
    })
}

export function useMnml() {
    return {
        mnml: mnmlInstance as Mnml,
        state: mnmlState,
    }
}
