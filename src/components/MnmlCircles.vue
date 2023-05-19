<template>
    <div class="main-interface">
        <div class="pitch-select">
            <button :class="{active: selectedPitchIndex === -1}" class="unselect" @click="selectPitch(-1)" />
            <button
                v-for="(color, index) of COLORS"
                :key="color"
                :class="{active: selectedPitchIndex === index}"
                :style="{background: `rgb(${color})`}"
                @click="selectPitch(index)"
            />
        </div>

        <canvas ref="canvas" @click="handleClick"></canvas>

        <div class="inner-circle-settings">
            <mnml-number-input id="voices" :min="VOICES_MIN" :max="VOICES_MAX" v-model="mnml.activeVoices"
                >Voices</mnml-number-input
            >
            <mnml-select id="pentatonic" :items="SCALES" v-model="mnml.scale" item-title="name">Pentatonik</mnml-select>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from 'vue'

import MnmlNumberInput from '@/components/forms/MnmlNumberInput.vue'
import MnmlSelect from '@/components/forms/MnmlSelect.vue'

import {type PitchIndex, useMnml, VOICES_MAX} from '../mnml'
import {COLORS, MnmlInterface, SCALES, VOICES_MIN} from '../mnml'

const {mnml} = useMnml()

const canvas = ref<HTMLCanvasElement>()
const selectedPitchIndex = ref<PitchIndex | -1 | null>(null)
let renderer: MnmlInterface

onMounted(() => {
    if (!canvas.value || !mnml) {
        return
    }
    renderer = new MnmlInterface(canvas.value, mnml)
    renderer.startDrawing()
    mnml.start()
})

onUnmounted(() => {
    renderer?.destroy()
    mnml.stop()
})

function selectPitch(index: number): void {
    selectedPitchIndex.value = selectedPitchIndex.value === index
        ? null
        : (index as PitchIndex | -1)
}

function handleClick(event: MouseEvent): void {
    const currentValue = selectedPitchIndex.value
    if (currentValue !== null) {
        const pitchIndex = currentValue < 0
            ? null
            : (currentValue as PitchIndex)
        renderer?.clicked(event.offsetX, event.offsetY, pitchIndex)
    }
}
</script>

<style lang="sass" scoped>
.main-interface
    position: relative
    width: 100vmin
    aspect-ratio: 1


.pitch-select
    position: absolute
    display: grid
    grid: repeat(3, 1fr) / repeat(3, 1fr)
    gap: 8%
    width: 22%
    height: 22%

    button
        width: 100%
        height: 100%
        margin: 0
        border: 1px solid #000
        border-radius: 50%

        &.active
            box-shadow: 0 0 6px 2px #000

        &:nth-child(6)
            grid-column: 1

.inner-circle-settings
    position: absolute
    top: 40%
    left: 40%
    width: 20%
    height: 20%
    overflow: hidden
    border-radius: 50%
</style>
