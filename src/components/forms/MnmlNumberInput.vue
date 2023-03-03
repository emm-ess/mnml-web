<template>
    <label :for="id">
        <slot />
    </label>
    <div class="input-line">
        <button :disabled="value <= min" @click.prevent="() => change(-1)">-</button>
        <input type="number" :name="id" :id="id" :min="min" :max="max" v-model="value" />
        <button :disabled="value >= max" @click.prevent="() => change(1)">+</button>
    </div>
</template>

<script lang="ts">
import {Model, Options, Prop, Vue} from 'vue-property-decorator'

@Options({
    name: 'MnmlSelect',
})
export default class MnmlSelect extends Vue {
    @Model('modelValue', {type: Number})
        value!: number

    @Prop({type: String, required: true})
    readonly id!: string

    @Prop({type: Number, required: true})
    readonly min!: number

    @Prop({type: Number, required: true})
    readonly max!: number

    change(amount: number): void {
        this.value = Math.min(Math.max(this.value + amount, this.min), this.max)
    }
}
</script>

<style lang="sass">
@use 'vanilla-framework' as *
@include vf-base
@include vf-b-forms
</style>

<style lang="sass" scoped>
.input-line
    display: flex

button,
input
    margin: 0

input
    flex: 1 1 auto
    min-width: unset
</style>
