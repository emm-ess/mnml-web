<template>
    <div class="main-interface">
        <div class="pitch-select">
            <mnml-round-button
                :class="{active: selectedPitchIndex === -1}"
                class="unselect"
                @click="selectPitch(-1)"
            />
            <mnml-round-button
                v-for="(color, index) of COLORS"
                :key="color"
                :class="{active: selectedPitchIndex === index}"
                :style="{background: `rgb(${color})`}"
                @click="selectPitch(index)"
            />
        </div>

        <div class="controls">
            <mnml-icon-button
                class="play"
                icon="play"
                @click="mnml.start()"
            />
            <mnml-icon-button
                class="stop"
                icon="stop"
                @click="mnml.stop()"
            />
            <mnml-icon-button
                class="pause"
                icon="pause"
                @click="mnml.pause()"
            />
            <mnml-icon-button
                class="restart"
                icon="restart"
                @click="mnml.restart()"
            />
            <mnml-icon-button
                class="random-fill"
                icon="change-version"
                @click="mnml.randomFill()"
            />
            <mnml-icon-button
                class="clear"
                icon="delete"
                @click="mnml.clear()"
            />
        </div>

        <canvas ref="canvas" @click="handleClick" />

        <div class="inner-circle-settings">
            <mnml-number-input-big
                id="voices"
                v-model="mnml.activeVoices"
                :min="VOICES_MIN"
                :max="VOICES_MAX"
            >
                Voices
            </mnml-number-input-big>
            <mnml-select
                id="pentatonic"
                v-model="mnml.scale"
                :items="SCALES"
                item-title="name"
            >
                Pentatonik
            </mnml-select>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from 'vue'

import MnmlIconButton from '@/components/buttons/MnmlIconButton.vue'
import MnmlRoundButton from '@/components/buttons/MnmlRoundButton.vue'
import MnmlNumberInputBig from '@/components/forms/MnmlNumberInputBig.vue'
import MnmlSelect from '@/components/forms/MnmlSelect.vue'
import {COLORS, MnmlInterface, type PitchIndex, SCALES, useMnml, VOICES_MAX, VOICES_MIN} from '@/mnml'

const mnml = useMnml()

const canvas = ref<HTMLCanvasElement>()
const selectedPitchIndex = ref<PitchIndex | -1 | null>(null)
let renderer: MnmlInterface

onMounted(() => {
    if (!canvas.value || !mnml) {
        return
    }
    renderer = new MnmlInterface(canvas.value, mnml)
    renderer.startDrawing()
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
%corner-grid
    position: absolute
    display: grid
    grid: repeat(3, 1fr) / repeat(3, 1fr)
    gap: 8%
    width: 22%
    height: 22%

    button
        width: 100%
        height: 100%

.main-interface
    position: relative
    width: 100vmin
    height: 100vmin
    aspect-ratio: 1

.pitch-select
    @extend %corner-grid
    // stylelint..

    button:nth-child(6)
        grid-column: 1

.controls
    top: 0
    right: 0
    @extend %corner-grid

    button
        &:nth-child(4)
            grid-column: 2

        &:nth-child(6)
            grid-column: 3

.inner-circle-settings
    position: absolute
    top: 40%
    left: 40%
    width: 20%
    height: 20%
    overflow: hidden
    border-radius: 50%
</style>
