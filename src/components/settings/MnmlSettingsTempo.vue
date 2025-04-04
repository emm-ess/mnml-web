<template>
    <fieldset>
        <legend>Tempo</legend>

        <mnml-switch id="bpm-relative" v-model="relativeBpm">
            Relative BPM
        </mnml-switch>

        <table>
            <thead>
                <tr>
                    <th
                        class="col-track-1 col-single"
                        scope="col"
                        colspan="2"
                    >
                        1
                    </th>
                    <th
                        class="col-track-1 col-single"
                        scope="col"
                        colspan="2"
                    >
                        2
                    </th>
                    <th
                        class="col-track-1 col-single"
                        scope="col"
                        colspan="2"
                    >
                        3
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="2">
                        <mnml-number-input
                            id="bpm-1"
                            v-model="bpms[0]"
                            :min="0"
                            :max="300"
                            label-invisible
                        >
                            BPM Ticker 1
                        </mnml-number-input>
                    </td>
                    <td colspan="2">
                        <mnml-number-input
                            id="bpm-1"
                            v-model="bpms[1]"
                            :min="0"
                            :max="300"
                            :readonly="relativeBpm"
                            label-invisible
                        >
                            BPM Ticker 2
                        </mnml-number-input>
                    </td>
                    <td colspan="2">
                        <mnml-number-input
                            id="bpm-1"
                            v-model="bpms[2]"
                            :min="0"
                            :max="300"
                            :readonly="relativeBpm"
                            label-invisible
                        >
                            BPM Ticker 3
                        </mnml-number-input>
                    </td>
                </tr>
                <tr>
                    <td>Relativ</td>
                    <td colspan="2">
                        <mnml-number-input
                            id="bpm-1"
                            v-model="relativeBpm1"
                            :min="0"
                            :max="10"
                            :readonly="!relativeBpm"
                            label-invisible
                        >
                            Relatives Tempo 1 & 2
                        </mnml-number-input>
                    </td>
                    <td colspan="2">
                        <mnml-number-input
                            id="bpm-1"
                            v-model="relativeBpm2"
                            :min="0"
                            :max="10"
                            :readonly="!relativeBpm"
                            label-invisible
                        >
                            Relatives Tempo 2 & 3
                        </mnml-number-input>
                    </td>
                    <td />
                </tr>
            </tbody>
        </table>
    </fieldset>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue'

import MnmlNumberInput from '@/components/inputs/MnmlNumberInput.vue'
import MnmlSwitch from '@/components/inputs/MnmlSwitch.vue'
import {objectPropModelArray} from '@/helper/vue.ts'
import {useMnml} from '@/mnml'
import {MnmlTicker} from '@/mnml/mnml-ticker.ts'

const mnml = useMnml()

const relativeBpm = ref(MnmlTicker.relativeBpmSetting)
watch(relativeBpm, (newValue) => {
    MnmlTicker.relativeBpmSetting = newValue
})

const bpms = objectPropModelArray(mnml.tickers, 'bpm')

const relativeBpm1 = computed({
    get() {
        return bpms.value[1] / bpms.value[0]
    },
    set(newValue) {
        bpms.value[1] = bpms.value[0] * newValue
    },
})
const relativeBpm2 = computed({
    get() {
        return bpms.value[2] / bpms.value[1]
    },
    set(newValue) {
        bpms.value[2] = bpms.value[1] * newValue
    },
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
    width: math.percentage(math.div(7, 48))

.col-divided
    width: math.percentage(math.div(8.5, 48))

:deep(.volume input.vertical)
    height: 60px
</style>
