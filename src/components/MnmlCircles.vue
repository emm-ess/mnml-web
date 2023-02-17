<template>
    <canvas class="mnml-renderer" @click="handleClick"></canvas>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-property-decorator'

import {MnmlInterface} from '../mnml'

@Options({
    name: 'MnmlCircles',
})
export default class MnmlCircles extends Vue {
    renderer: MnmlInterface | undefined

    async mounted() {
        this.renderer = new MnmlInterface(this.$el, this.$mnml)
        this.renderer.startDrawing()
        this.$mnml.start()
    }

    unmounted() {
        this.renderer?.destroy()
        this.$mnml.stop()
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
