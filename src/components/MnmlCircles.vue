<template>
    <canvas class="mnml-renderer" @click="handleClick"></canvas>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-property-decorator'

import {MnmlRenderer} from '../mnml/mnml-renderer'

@Options({
    name: 'MnmlCircles',
})
export default class MnmlCircles extends Vue {
    renderer: MnmlRenderer | undefined

    mounted() {
        this.renderer = new MnmlRenderer(this.$el)
        this.renderer.startDrawing()
    }

    unmounted() {
        this.renderer?.destroy()
    }

    handleClick(event: MouseEvent): void {
        this.renderer?.clicked(event.offsetX, event.offsetY)
    }
}
</script>

<style lang="sass" scoped>
.mnml-renderer
    width: 100%
    height: 100%
</style>
