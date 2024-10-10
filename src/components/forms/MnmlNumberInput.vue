<template>
    <label :for="id">
        <slot />
    </label>
    <div class="input-line">
        <button :disabled="model <= min" @click.prevent="model--">
            -
        </button>
        <input
            :id="id"
            v-model.number="model"
            type="number"
            :name="id"
            :min="min"
            :max="max"
        >
        <button :disabled="model >= max" @click.prevent="model++">
            +
        </button>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    id: string
    min: number
    max: number
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
