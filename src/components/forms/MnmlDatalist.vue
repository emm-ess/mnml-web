<template>
    <datalist :id="id">
        <option
            v-for="option in options"
            :key="option.value"
            :value="option.value"
            :label="option.label"
        />
    </datalist>
</template>

<script lang="ts" setup generic="ValueType extends string | number">
export type Option<ValueType> = {
    value: ValueType
    label?: string
}

defineProps<{
    id: string
    options: Option<ValueType>[]
}>()
</script>
