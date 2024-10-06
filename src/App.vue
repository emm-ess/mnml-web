<template>
    <mnml-startup-error v-if="hasStartupError" />
    <mnml-circles v-else />
</template>

<script setup lang="ts">
import {computed} from 'vue'

import MnmlStartupError from '@/components/modal/MnmlStartupError.vue'
import {MNML_STATE, useMnml} from '@/mnml'

import MnmlCircles from './components/MnmlCircles.vue'

const {state: mnmlState} = useMnml()

const hasStartupError = computed(() => {
    return [
        MNML_STATE.UNKNOWN,
        MNML_STATE.MIDI_UNAVAILABLE,
        MNML_STATE.MIDI_NOT_ENABLED,
        MNML_STATE.NO_OUTPUT_AVAILABLE,
        MNML_STATE.NO_OUTPUT_SELECTED,
    ].includes(mnmlState.value)
})
</script>
