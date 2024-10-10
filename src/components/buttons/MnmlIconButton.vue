<template>
    <mnml-round-button class="has-icon">
        <i :class="`p-icon--${icon}`" />
    </mnml-round-button>
</template>

<script setup lang="ts">
import MnmlRoundButton from './MnmlRoundButton.vue'

defineProps<{
    icon: string
}>()
</script>

<style lang="sass">
@use '../../../node_modules/vanilla-framework/index' as *
@include vf-base
@include vf-p-icons
// @include vf-p-icon-status-waiting
// @include vf-p-icon-user-group
@include vf-p-icon-play
@include vf-p-icon-stop
@include vf-p-icon-pause
@include vf-p-icon-restart
@include vf-p-icon-change-version
@include vf-p-icon-delete
</style>
