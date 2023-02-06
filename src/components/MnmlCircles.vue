<template>
    <canvas class="mnml-renderer" @click="handleClick"></canvas>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-property-decorator'

import {Mnml, MnmlInterface} from '../mnml'

@Options({
    name: 'MnmlCircles',
})
export default class MnmlCircles extends Vue {
    renderer: MnmlInterface | undefined
    player: Mnml | undefined

    async mounted() {
        this.player = await Mnml.getInstance()
        this.renderer = new MnmlInterface(this.$el, this.player)
        this.renderer.startDrawing()
        this.player.start()
    }

    unmounted() {
        this.renderer?.destroy()
        this.player?.stop()
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
