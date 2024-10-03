<template>
    <div id="modal" class="p-modal">
        <section
            class="p-modal__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <header class="p-modal__header">
                <h2 id="modal-title" class="p-modal__title">
                    <slot name="header" />
                </h2>
                <button
                    v-if="closable"
                    class="p-modal__close"
                    aria-label="Modal schließen"
                    aria-controls="modal"
                >
                    Schließen
                </button>
            </header>

            <main>
                <slot />
            </main>

            <footer v-if="$slots.footer" class="p-modal__footer">
                <slot name="footer" />
            </footer>
        </section>
    </div>
</template>

<script lang="ts" setup>
withDefaults(
    defineProps<{
        closable?: boolean
    }>(),
    {
        closable: true,
    },
)
</script>

<style lang="sass">
@use 'vanilla-framework' as *
@include vf-base
@include vf-p-modal
</style>
