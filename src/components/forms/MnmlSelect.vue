<template>
    <label
        :for="id"
        :class="{
            'u-off-screen': labelInvisible,
        }"
    >
        <slot />
    </label>
    <select
        :id="id"
        v-model="model"
        :name="id"
    >
        <template v-if="grouped">
            <optgroup
                v-for="group in items"
                :key="
                    // @ts-expect-error
                    group.label
                "
                :label="
                    // @ts-expect-error
                    group.label
                "
            >
                <option
                    v-for="
                        // @ts-expect-error
                        item in group.items"
                    :key="item[itemTitle] || item"
                    :value="itemValue ? item[itemValue] : item"
                >
                    {{ item[itemTitle] || item }}
                </option>
            </optgroup>
        </template>
        <template v-else>
            <option
                v-for="item in items"
                :key="
                    // @ts-expect-error
                    item[itemTitle] || item
                "
                :value="
                    itemValue
                        ? // @ts-expect-error
                            item[itemValue]
                        : item
                "
            >
                <!-- @vue-expect-error -->
                {{ item[itemTitle] || item }}
            </option>
        </template>
    </select>
</template>

<script lang="ts" setup generic="ValueType, Grouped extends boolean = false">
// TODO: have a look again for generic types, was:
// <
//     ValueType extends Record<any, unknown> & {[key in ItemTitle]: string},
//     ItemTitle extends string,
// >

const model = defineModel<ValueType | null>()

withDefaults(
    defineProps<{
        id: string
        // eslint-disable-next-line @stylistic/block-spacing
        items: Grouped extends true ? {label: string; items: ValueType[]}[] : ValueType[]
        itemTitle?: keyof ValueType
        itemValue?: keyof ValueType
        grouped?: Grouped
        labelInvisible?: boolean
    }>(),
    {
        itemTitle: 'title' as keyof ValueType,
        itemValue: undefined,
    },
)
</script>

<style lang="sass">
@use 'vanilla-framework' as *
@include vf-base
@include vf-b-forms

@include vf-u-off-screen
</style>
