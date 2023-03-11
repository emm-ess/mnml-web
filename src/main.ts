import './style/main.sass'

import {createApp} from 'vue'

import {createMnml} from '@/mnml/mnml-vue'

import App from './App.vue'

const app = createApp(App)

app.use(await createMnml())

app.mount('#app')
