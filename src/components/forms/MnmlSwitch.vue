<template>
    <label class="p-switch">
        <input
            :id="id"
            type="checkbox"
            class="p-switch__input"
            :checked="checked"
            role="switch"
        >
        <span class="p-switch__slider" />
        <span class="p-switch__label">
            <slot />
        </span>
    </label>
</template>

<script lang="ts" setup>
const checked = defineModel<boolean>({required: true})

defineProps<{
    id: string
}>()
</script>

<style lang="sass">
@use 'vanilla-framework' as *
@include vf-base
@include vf-p-switch
</style>
