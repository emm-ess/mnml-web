<template>
    <template v-if="mnml.midiState === MIDI_STATE.MIDI_UNAVAILABLE">
        <mnml-modal-base :closable="false">
            <template #header>
                Keine Midi Unterstützung
            </template>
            Dieser Browser hat keine Unterstützung für Midi.
        </mnml-modal-base>
    </template>

    <template v-else-if="mnml.midiState === MIDI_STATE.MIDI_NOT_ENABLED">
        <mnml-modal-base :closable="false">
            <template #header>
                Midi Unterstützung nicht erlaubt
            </template>
            Midi wurde für diese Webseite nicht erlaubt.
        </mnml-modal-base>
    </template>

    <template v-else-if="mnml.midiState === MIDI_STATE.NO_OUTPUT_AVAILABLE">
        <mnml-modal-base :closable="false">
            <template #header>
                Keine Midi Geräte
            </template>
            Es konnten keine Midi-Geräte gefunden werden.
        </mnml-modal-base>
    </template>

    <template v-else-if="mnml.midiState === MIDI_STATE.NO_OUTPUT_SELECTED">
        <mnml-modal-base :closable="false">
            <template #header>
                Kein Midi Gerät ausgewählt
            </template>

            <form @submit.prevent="setMidiInput">
                <mnml-midi-device-select v-model="selectedOutput" />

                <footer class="p-modal__footer">
                    <button class="p-button--positive u-no-margin--bottom" :disabled="!selectedOutput">
                        Speichern
                    </button>
                </footer>
            </form>
        </mnml-modal-base>
    </template>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import type {Output} from 'webmidi'

import MnmlMidiDeviceSelect from '@/components/forms/MnmlMidiDeviceSelect.vue'
import MnmlModalBase from '@/components/modal/MnmlModalBase.vue'
import {MIDI_STATE, useMnml} from '@/mnml'

const mnml = useMnml()
// Fixme: "any" shouldn't be needed here, but somehow Output !== Output
const selectedOutput = ref<any>(null)

function setMidiInput() {
    mnml.output = selectedOutput.value as Output
}
</script>

<style lang="sass">
@use 'vanilla-framework' as *
@include vf-base
@include vf-p-buttons
</style>
