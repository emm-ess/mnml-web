import type {Mnml} from '@/mnml'
import type {MNML_STATE} from '@/mnml/mnml-vue'

declare module 'vue' {
    type ComponentCustomProperties = {
        $mnmlState: MNML_STATE
        $mnml: Mnml
    }
}
