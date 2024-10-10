import './style/main.sass'

import {createApp} from 'vue'

import {Mnml} from '@/mnml/mnml'

import App from './App.vue'

await Mnml.enableWebMidi()

const app = createApp(App)
app.mount('#app')
