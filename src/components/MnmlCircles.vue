<template>
    <div class="pitch-select">
        <button
            v-for="(color, index) of colors"
            :key="color"
            :class="{active: selectedPitchIndex === index}"
            :style="{background: `rgb(${color})`}"
            @click="selectPitch(index)"
        />
    </div>

    <canvas ref="canvas" class="mnml-renderer" @click="handleClick"></canvas>
</template>

<script lang="ts">
import {Options, Ref, Vue} from 'vue-property-decorator'

import type {PitchIndex} from '../mnml'
import {COLORS, MnmlInterface} from '../mnml'

@Options({
    name: 'MnmlCircles',
})
export default class MnmlCircles extends Vue {
    @Ref()
    private readonly canvas!: HTMLCanvasElement

    colors = COLORS
    selectedPitchIndex: PitchIndex | null = null
    renderer: MnmlInterface | undefined

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
            : (index as PitchIndex)
    }

    handleClick(event: MouseEvent): void {
        if (this.selectedPitchIndex !== null) {
            this.renderer?.clicked(event.offsetX, event.offsetY, this.selectedPitchIndex)
        }
    }
}
</script>

<style lang="sass" scoped>
.mnml-renderer
    width: 100%
    height: 100%

.pitch-select
    button
        width: 60px
        height: 60px
        border-radius: 50%

        &.active
            border: 2px solid #000
</style>
