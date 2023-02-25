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

    <div class="main-interface">
        <canvas ref="canvas" @click="handleClick"></canvas>

        <div class="inner-circle-settings">
            <mnml-select id="pentatonic" :items="scales" v-model="$mnml.scale" item-title="name"
                >Pentatonik</mnml-select
            >
        </div>
    </div>
</template>

<script lang="ts">
import {Options, Ref, Vue} from 'vue-property-decorator'

import MnmlSelect from '@/components/forms/MnmlSelect.vue'

import type {PitchIndex} from '../mnml'
import {COLORS, MnmlInterface, SCALES} from '../mnml'

@Options({
    name: 'MnmlCircles',
    components: {MnmlSelect},
})
export default class MnmlCircles extends Vue {
    @Ref()
    private readonly canvas!: HTMLCanvasElement

    colors = COLORS
    selectedPitchIndex: PitchIndex | null = null
    renderer: MnmlInterface | undefined
    scales = SCALES

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
.pitch-select
    button
        width: 60px
        height: 60px
        border-radius: 50%

        &.active
            border: 2px solid #000

.main-interface
    position: relative
    width: 100vmin
    aspect-ratio: 1

.inner-circle-settings
    position: absolute
    top: 40%
    left: 40%
    width: 20%
    height: 20%
    overflow: hidden
    border-radius: 50%
</style>
