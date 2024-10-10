<template>
    <mnml-startup-error v-if="hasMidiError" />
    <mnml-circles v-else />
</template>

<script setup lang="ts">
import {computed} from 'vue'

import MnmlCircles from '@/components/MnmlCircles.vue'
import MnmlStartupError from '@/components/modal/MnmlStartupError.vue'
import {MIDI_STATE, useMnml} from '@/mnml'

const mnml = useMnml()

const hasMidiError = computed(() => {
    return [
        MIDI_STATE.UNKNOWN,
        MIDI_STATE.MIDI_UNAVAILABLE,
        MIDI_STATE.MIDI_NOT_ENABLED,
        MIDI_STATE.NO_OUTPUT_AVAILABLE,
        MIDI_STATE.NO_OUTPUT_SELECTED,
    ].includes(mnml.midiState)
})
</script>
