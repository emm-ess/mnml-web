<template>
    <label :for="id">
        <slot />
    </label>
    <select :name="id" :id="id" v-model="value">
        <option v-for="item in items" :key="item[itemTitle]" :value="item">{{ item[itemTitle] }}</option>
    </select>
</template>

<script lang="ts" setup>
import {computed} from 'vue'

// TODO: have a look again for generic types, was:
// <
//     ValueType extends Record<any, unknown> & {[key in ItemTitle]: string},
//     ItemTitle extends string,
// >
type ItemTitle = string
type ModelValue = any

type Props = {
    id: string
    items: ModelValue[]
    itemTitle?: ItemTitle
    modelValue: ModelValue
}

// TODO: this is actually valid => error in Vue Types?
// @ts-ignore
const props = withDefaults(defineProps<Props>(), {
    itemTitle: 'title',
})

const emit = defineEmits<{
    (event: 'update:modelValue', value: ModelValue): void
}>()

const value = computed({
    get(): ModelValue {
        return props.modelValue
    },
    set(value: ModelValue) {
        emit('update:modelValue', value)
    },
})
</script>

<style lang="sass">
@use 'vanilla-framework' as *
@include vf-base
@include vf-b-forms
</style>
