<template>
    <label :for="id">
        <slot />
    </label>
    <div class="input-line">
        <button :disabled="modelValue <= min" @click.prevent="() => change(-1)">-</button>
        <input type="number" :name="id" :id="id" :min="min" :max="max" v-model="value" />
        <button :disabled="modelValue >= max" @click.prevent="() => change(1)">+</button>
    </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'

const props = defineProps<{
    id: string
    min: number
    max: number
    modelValue: number
}>()

const emit = defineEmits<{
    (event: 'update:modelValue', value: number): void
}>()

const value = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    },
})

function change(amount: number): void {
    const value = Math.min(Math.max(props.modelValue + amount, props.min), props.max)
    emit('update:modelValue', value)
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
