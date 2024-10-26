<template>
    <label
        :id="labelId"
        :for="id"
        :class="{
            'u-off-screen': labelInvisible,
        }"
    >
        <slot />
    </label>
    <input
        :id="id"
        v-model.number="model"
        class="range-input"
        :class="{
            vertical,
            ['thumb-only']: thumbOnly,
            'has-datalist': dataListId,
        }"
        :name="id"
        :min="min"
        :max="max"
        :step="step"
        type="range"
        :aria-labelledby="labelId"
        :list="dataListId"
    >
    <input
        :id="numberInputId"
        v-model.number="model"
        class="number-input"
        type="number"
        :name="id"
        :min="min"
        :max="max"
        :aria-labelledby="labelId"
    >
</template>

<script lang="ts" setup>
import {computed} from 'vue'

const props = defineProps<{
    id: string
    min: number
    max: number
    step?: number
    thumbOnly?: boolean
    vertical?: boolean
    labelInvisible?: boolean
    dataListId?: string
}>()

const model = defineModel<number>({required: true})

const labelId = computed(() => {
    return `${props.id}-label`
})

const numberInputId = computed(() => {
    return `${props.id}-number-input`
})

const percentage = computed(() => {
    return ((model.value - props.min) / (props.max - props.min)) * 100 + '%'
})
</script>

<style lang="sass">
@use 'vanilla-framework' as *
@include vf-base
@include vf-b-forms

@include vf-u-off-screen
</style>

<style lang="sass" scoped>
.range-input
    &.vertical
        // values taken from vanilla-framework
        width: 0.1875rem
        margin: 0 0.40625rem
        writing-mode: vertical-rl
        transform: rotateZ(180deg)
        vertical-align: initial

        &::-webkit-slider-thumb
            margin: 0

    &.thumb-only
        background: var(--vf-color-border-default)

    &:not(.thumb-only)
        background-image: linear-gradient(180deg, var(--vf-color-link-default) v-bind('percentage'), var(--vf-color-border-default) v-bind('percentage'))

    &.has-datalist::-webkit-slider-container
        min-block-size: 0

.number-input
    margin-top: 0.40625rem
</style>
