<template>
    <button class="p-button">
        <slot />
    </button>
</template>

<style lang="sass">
@use '../../../node_modules/vanilla-framework/index' as *
@include vf-base
@include vf-p-buttons
</style>

<style lang="sass" scoped>
button
    margin: 0
    border: 1px solid #000
    border-radius: 50%

.active
    box-shadow: 0 0 6px 2px #000
</style>
