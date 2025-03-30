<template>
    <mnml-icon-button
        class="button-open"
        icon="settings"
        @click="open = true"
    />

    <dialog v-if="open" class="settings-layer">
        <mnml-icon-button
            class="button-close"
            icon="close"
            @click="open = false"
        />
        <form>
            <h2>Einstellungen</h2>
            <fieldset>
                <legend>Generell</legend>
                <mnml-midi-device-select v-model="mnml.output" />

                <mnml-switch id="general-midi" v-model="generalMidiDevice">
                    General Midi Gerät
                </mnml-switch>

                <mnml-select
                    id="pentatonic"
                    v-model="mnml.scale"
                    :items="SCALES"
                    item-title="name"
                >
                    Pentatonik
                </mnml-select>
            </fieldset>

            <fieldset>
                <legend>Tracks</legend>
                <table>
                    <thead>
                        <tr>
                            <th class="col-setting col-single">
                                Track
                            </th>
                            <th
                                class="col-track-1 col-single"
                                rowspan="2"
                                scope="col"
                            >
                                1
                            </th>
                            <th
                                class="col-track-2 col-divided"
                                colspan="3"
                                scope="col"
                            >
                                2
                            </th>
                            <th
                                class="col-track-3 col-divided"
                                colspan="3"
                                scope="col"
                            >
                                3
                            </th>
                            <th
                                class="col-track-4 col-divided"
                                colspan="3"
                                scope="col"
                            >
                                4
                            </th>
                            <th
                                class="col-track-5 col-divided"
                                colspan="3"
                                scope="col"
                            >
                                5
                            </th>
                        </tr>
                        <tr>
                            <th>Voice</th>
                            <th scope="col">
                                1
                            </th>
                            <th scope="col">
                                2
                            </th>
                            <th scope="col">
                                3
                            </th>
                            <th scope="col">
                                1
                            </th>
                            <th scope="col">
                                2
                            </th>
                            <th scope="col">
                                3
                            </th>
                            <th scope="col">
                                1
                            </th>
                            <th scope="col">
                                2
                            </th>
                            <th scope="col">
                                3
                            </th>
                            <th scope="col">
                                1
                            </th>
                            <th scope="col">
                                2
                            </th>
                            <th scope="col">
                                3
                            </th>
                        </tr>
                    </thead>
                    <mnml-table-form-body :form="form" />
                </table>
            </fieldset>
        </form>

        <mnml-datalist id="stereo-dl" :options="stereoDataList" />
    </dialog>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'

import MnmlIconButton from '@/components/buttons/MnmlIconButton.vue'
import MnmlDatalist from '@/components/forms/MnmlDatalist.vue'
import MnmlMidiDeviceSelect from '@/components/forms/MnmlMidiDeviceSelect.vue'
import MnmlNumberInput from '@/components/forms/MnmlNumberInput.vue'
import MnmlRange from '@/components/forms/MnmlRange.vue'
import MnmlSelect from '@/components/forms/MnmlSelect.vue'
import MnmlSwitch from '@/components/forms/MnmlSwitch.vue'
import MnmlTableFormBody, {type FormRow} from '@/components/forms/MnmlTableFormBody.vue'
import {GM_PROGRAMS} from '@/helper/general-midi'
import {objectPropModelArray} from '@/helper/vue'
import {SCALES, useMnml} from '@/mnml'

const mnml = useMnml()
const generalMidiDevice = ref(true)
const open = ref(false)

const stereoDataList = [{value: -63, label: 'links'}, {value: 0}, {value: 63, label: 'rechts'}]

const channelNumbers = objectPropModelArray(mnml.voices, 'channelNumber')
const midiPrograms = objectPropModelArray(mnml.tracks, 'midiProgram')
const octaves = objectPropModelArray(mnml.tracks, 'octave')
const volumes = objectPropModelArray(mnml.voices, 'volume')
const panning = objectPropModelArray(mnml.voices, 'pan')

const form = computed<FormRow[]>(() => {
    const programInputBase = {
        title: 'Programm',
        id: 'programm',
        spans: [1, 3, 3, 3, 3],
        models: midiPrograms.value,
    }
    const programInput = generalMidiDevice.value
        ? {
            ...programInputBase,
            component: MnmlSelect,
            componentProps: {
                items: GM_PROGRAMS,
                itemTitle: 'name',
                itemValue: 'program',
                grouped: true,
            },
        }
        : {
            ...programInputBase,
            component: MnmlNumberInput,
            componentProps: {min: 0, max: 127, labelInvisible: true},
        }

    const settings = [
        {
            title: 'Kanal',
            id: 'channel',
            component: MnmlNumberInput,
            componentProps: {min: 1, max: 16, labelInvisible: true},
            models: channelNumbers.value,
        },
        programInput,
        {
            title: 'Oktave',
            id: 'octave',
            spans: [1, 3, 3, 3, 3],
            component: MnmlNumberInput,
            componentProps: {min: 0, max: 9, labelInvisible: true},
            models: octaves.value,
        },
    ] as FormRow[]

    if (generalMidiDevice.value) {
        settings.push(
            {
                title: 'Lautstärke',
                id: 'volume',
                rowClass: 'volume',
                component: MnmlRange,
                componentProps: {min: 0, max: 127, step: 1, labelInvisible: true, vertical: true},
                models: volumes.value,
            },
            {
                title: 'Stereo',
                id: 'panning',
                component: MnmlRange,
                componentProps: {
                    min: -63,
                    max: 63,
                    step: 1,
                    labelInvisible: true,
                    thumbOnly: true,
                    dataListId: 'stereo-dl',
                },
                models: panning.value,
            },
        )
    }

    return settings
})
</script>

<style lang="sass" scoped>
@use 'sass:math'

.button-open,
.button-close
    position: absolute
    top: 0
    right: 0

.settings-layer
    position: fixed
    top: 0
    right: 0
    left: unset
    display: block
    width: 100%
    height: 100vh

.col-single
    width: math.percentage(7 / 48)

.col-divided
    width: math.percentage(8.5 / 48)

:deep(.volume input.vertical)
    height: 60px
</style>
