import {reactive} from 'vue'

import {Mnml} from './mnml'

await Mnml.enableWebMidi()
const instance = new Mnml()
const mnmlReactive = reactive<Mnml>(instance)

export function useMnml(): Mnml {
    return mnmlReactive as Mnml
}
