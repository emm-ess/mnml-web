import type {Mnml} from '@/mnml'
import type {MNML_STATE} from '@/mnml/mnml-vue'

export {}

declare module 'vue' {
    interface ComponentCustomProperties {
        $mnmlState: MNML_STATE
        $mnml: Mnml
    }
}
