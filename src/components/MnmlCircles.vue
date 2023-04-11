<template>
    <div class="main-interface">
        <div class="pitch-select">
            <button :class="{active: selectedPitchIndex === -1}" class="unselect" @click="selectPitch(-1)" />
            <button
                v-for="(color, index) of colors"
                :key="color"
                :class="{active: selectedPitchIndex === index}"
                :style="{background: `rgb(${color})`}"
                @click="selectPitch(index)"
            />
        </div>

        <canvas ref="canvas" @click="handleClick"></canvas>

        <div class="inner-circle-settings">
            <mnml-number-input id="voices" :min="voicesMin" :max="voicesMax" v-model="$mnml.activeVoices"
                >Voices</mnml-number-input
            >
            <mnml-select id="pentatonic" :items="scales" v-model="$mnml.scale" item-title="name"
                >Pentatonik</mnml-select
            >
        </div>
    </div>
</template>

<script lang="ts">
import {Options, Ref, Vue} from 'vue-property-decorator'

import MnmlNumberInput from '@/components/forms/MnmlNumberInput.vue'
import MnmlSelect from '@/components/forms/MnmlSelect.vue'

import {type PitchIndex, VOICES_MAX} from '../mnml'
import {COLORS, MnmlInterface, SCALES, VOICES_MIN} from '../mnml'

@Options({
    name: 'MnmlCircles',
    components: {MnmlNumberInput, MnmlSelect},
})
export default class MnmlCircles extends Vue {
    @Ref()
    private readonly canvas!: HTMLCanvasElement

    colors = COLORS
    selectedPitchIndex: PitchIndex | -1 | null = null
    renderer: MnmlInterface | undefined
    scales = SCALES
    voicesMin = VOICES_MIN
    voicesMax = VOICES_MAX

    async mounted() {
        this.renderer = new MnmlInterface(this.canvas, this.$mnml)
        this.renderer.startDrawing()
        this.$mnml.start()
    }

    unmounted() {
        this.renderer?.destroy()
        this.$mnml.stop()
    }

    selectPitch(index: number): void {
        this.selectedPitchIndex = this.selectedPitchIndex === index
            ? null
            : (index as PitchIndex | -1)
    }

    handleClick(event: MouseEvent): void {
        if (this.selectedPitchIndex !== null) {
            const pitchIndex = this.selectedPitchIndex < 0
                ? null
                : (this.selectedPitchIndex as PitchIndex)
            this.renderer?.clicked(event.offsetX, event.offsetY, pitchIndex)
        }
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
