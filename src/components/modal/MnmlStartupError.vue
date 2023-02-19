<template>
    <template v-if="$mnmlState === MNML_STATE.MIDI_UNAVAILABLE">
        <mnml-modal-base :closable="false">
            <template #header>Keine Midi Unterstützung</template>
            Dieser Browser hat keine Unterstützung für Midi.
        </mnml-modal-base>
    </template>

    <template v-else-if="$mnmlState === MNML_STATE.MIDI_NOT_ENABLED">
        <mnml-modal-base :closable="false">
            <template #header>Midi Unterstützung nicht erlaubt</template>
            Midi wurde für diese Webseite nicht erlaubt.
        </mnml-modal-base>
    </template>

    <template v-else-if="$mnmlState === MNML_STATE.NO_OUTPUT_AVAILABLE">
        <mnml-modal-base :closable="false">
            <template #header>Keine Midi Geräte</template>
            Es konnten keine Midi-Geräte gefunden werden.
        </mnml-modal-base>
    </template>

    <template v-else-if="$mnmlState === MNML_STATE.NO_OUTPUT_SELECTED">
        <mnml-modal-base :closable="false">
            <template #header>Kein Midi Gerät ausgewählt</template>

            <form @submit.prevent="setMidiInput">
                <mnml-select id="output" v-model="selectedOutput" :items="outputs" item-title="name">Gerät</mnml-select>

                <footer class="p-modal__footer">
                    <button class="p-button--positive u-no-margin--bottom" :disabled="!selectedOutput">
                        Speichern
                    </button>
                </footer>
            </form>
        </mnml-modal-base>
    </template>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-property-decorator'
import type {Output} from 'webmidi'
import {WebMidi} from 'webmidi'

import MnmlSelect from '@/components/forms/MnmlSelect.vue'
import MnmlModalBase from '@/components/modal/MnmlModalBase.vue'
import {MNML_STATE} from '@/mnml'

@Options({
    name: 'MnmlStartupError',
    components: {
        MnmlModalBase,
        MnmlSelect,
    },
})
export default class MnmlStartupError extends Vue {
    MNML_STATE = MNML_STATE

    outputs = WebMidi.outputs

    selectedOutput: Output | null = null

    setMidiInput() {
        this.$mnml.output = this.selectedOutput
    }
}
</script>

<style lang="sass">
@use 'vanilla-framework' as *
@include vf-base
@include vf-p-buttons
</style>
