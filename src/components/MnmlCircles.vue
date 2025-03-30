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
                class="stop"
                icon="stop"
                @click="mnml.stop()"
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

        <div class="quick-settings">
            <mnml-number-input-big
                id="voices"
                v-model="mnml.activeVoices"
                :min="VOICES_MIN"
                :max="VOICES_MAX"
            >
                Voices
            </mnml-number-input-big>
        </div>

        <canvas ref="canvas" @click="handleClick" />

        <div class="inner-circle-settings">
            <mnml-icon-button
                class="play-pause"
                :icon="mnml.state !== MNML_STATE.PLAYING ? 'play' : 'pause'"
                @click="togglePlayPause"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from 'vue'

import MnmlIconButton from '@/components/buttons/MnmlIconButton.vue'
import MnmlRoundButton from '@/components/buttons/MnmlRoundButton.vue'
import MnmlNumberInputBig from '@/components/forms/MnmlNumberInputBig.vue'
import {COLORS, MNML_STATE, MnmlInterface, type PitchIndex, useMnml, VOICES_MAX, VOICES_MIN} from '@/mnml'

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

function togglePlayPause(): void {
    if (mnml.state !== MNML_STATE.PLAYING) {
        mnml.start()
    }
    else {
        mnml.pause()
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
    bottom: 0
    left: 0
    grid: repeat(3, 1fr) / repeat(3, 1fr)
    @extend %corner-grid

    button
        &:nth-child(1),
        &:nth-child(2)
            grid-row: 2

        &:nth-child(3),
        &:nth-child(4)
            grid-row: 3

.quick-settings
    position: absolute
    right: 0
    bottom: 0
    width: 22%

.inner-circle-settings
    position: absolute
    top: 40%
    left: 40%
    display: flex
    place-items: center
    place-content: center
    width: 20%
    height: 20%
    overflow: hidden
    border-radius: 50%

.play-pause
    width: 50%
    height: 50%
</style>
