<template>
    <mnml-select
        id="output"
        v-model="selectedDevice"
        :items="availableDevices"
    >
        Gerät
    </mnml-select>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {type Output, WebMidi} from 'webmidi'

import MnmlSelect from '@/components/inputs/MnmlSelect.vue'

const model = defineModel<Output | null>()

const selectedDevice = computed<string | null>({
    get() {
        return model.value?.name || null
    },
    set(value) {
        model.value = WebMidi.outputs.find((output) => output.name === value) || null
    },
})

const availableDevices = computed(() => {
    return WebMidi.outputs.map((output) => output.name)
})
</script>
