<template>
    <label :for="id">
        <slot />
    </label>
    <select
        :id="id"
        v-model="model"
        :name="id"
    >
        <option
            v-for="item in items"
            :key="
                // @ts-expect-error
                item[itemTitle]
            "
            :value="item"
        >
            <!-- @vue-expect-error -->
            {{ item[itemTitle] }}
        </option>
    </select>
</template>

<script lang="ts" setup generic="ValueType extends Record<string, unknown>">
// TODO: have a look again for generic types, was:
// <
//     ValueType extends Record<any, unknown> & {[key in ItemTitle]: string},
//     ItemTitle extends string,
// >

const model = defineModel<ValueType | null>({
    required: true,
})

withDefaults(
    defineProps<{
        id: string
        items: ValueType[]
        itemTitle?: keyof ValueType
    }>(),
    {
        itemTitle: 'title' as keyof ValueType,
    },
)
</script>

<style lang="sass">
@use 'vanilla-framework' as *
@include vf-base
@include vf-b-forms
</style>
