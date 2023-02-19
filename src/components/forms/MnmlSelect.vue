<template>
    <label :for="id">
        <slot />
    </label>
    <select :name="id" :id="id" v-model="value">
        <option v-for="item in items" :key="item[itemTitle]" :value="item">{{ item[itemTitle] }}</option>
    </select>
</template>

<script lang="ts">
import {Model, Options, Prop, Vue} from 'vue-property-decorator'

@Options({
    name: 'MnmlSelect',
})
export default class MnmlSelect<
    ValueType extends Record<any, unknown> & {[key in ItemTitle]: string},
    ItemTitle extends string,
> extends Vue {
    @Model('modelValue')
        value!: ValueType

    @Prop({type: Array, required: true})
    readonly items!: ValueType[]

    @Prop({type: String, required: true})
    readonly id!: string

    @Prop({type: String, default: 'title'})
    readonly itemTitle!: ItemTitle
}
</script>

<style lang="sass">
@use 'vanilla-framework' as *
@include vf-base
@include vf-b-forms
</style>
