import './style/main.sass'

import {createApp} from 'vue'

import {createMnml, MnmlVuePlugin} from '@/mnml/mnml-vue'

import App from './App.vue'

await createMnml()

const app = createApp(App)
app.use(MnmlVuePlugin)
app.mount('#app')
