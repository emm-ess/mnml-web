<template>
    <label
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
        type="number"
        :name="id"
        :min="min"
        :max="max"
    >
</template>

<script lang="ts" setup>
const props = defineProps<{
    id: string
    min: number
    max: number
    labelInvisible?: boolean
}>()

const model = defineModel<number>({
    required: true,
    set(value) {
        return Math.min(Math.max(value, props.min), props.max)
    },
})
</script>

<style lang="sass">
@use 'vanilla-framework' as *
@include vf-base
@include vf-b-forms

@include vf-u-off-screen
</style>
