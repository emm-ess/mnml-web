<template>
    <tbody>
        <tr
            v-for="row of form"
            :key="row.id"
            :class="row.rowClass"
        >
            <th scope="row">
                {{ row.title }}
            </th>
            <template v-if="row.spans">
                <td
                    v-for="(span, index) of row.spans"
                    :key="`${row.id}-${index}`"
                    :colspan="span"
                >
                    <component
                        :is="row.component"
                        :id="`${row.id}-${index}`"
                        v-model="
                            // eslint-disable-next-line vue/valid-v-model
                            row.models[index]
                        "
                        v-bind="row.componentProps"
                    />
                </td>
            </template>
            <template v-else>
                <td v-for="(model, index) of row.models" :key="`${row.id}-${index}`">
                    <component
                        :is="row.component"
                        :id="`${row.id}-${index}`"
                        :model-value="model"
                        v-bind="row.componentProps"
                        @update:model-value="(newValue: unknown) => (row.models[index] = newValue)"
                    />
                </td>
            </template>
        </tr>
    </tbody>
</template>

<script lang="ts" setup>
import type {Component} from 'vue'

// ToDo: use generic to add typeinformation for props & model
export type FormRow<T extends Component = Component> = {
    title: string
    id: string
    rowClass?: string
    component: T
    // record is a built-in...

    componentProps?: Record<string, unknown>
    models: unknown[]
    spans?: number[]
}

defineProps<{
    form: FormRow[]
}>()
</script>

<style lang="sass" scoped>
:deep(input),
:deep(select)
    margin: 0
</style>
