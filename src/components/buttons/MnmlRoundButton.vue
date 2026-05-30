<template>
    <button class="p-button">
        <slot />
    </button>
</template>

<style lang="stylus" scoped>
button
    margin 0
    border 1px solid var(--vf-color-text-default)
    border-radius 50%

.active
    box-shadow 0 0 6px 2px var(--vf-color-text-default)
</style>
