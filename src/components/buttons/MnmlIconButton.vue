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
