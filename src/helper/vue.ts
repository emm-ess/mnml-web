import {ref, watch} from 'vue'

export function objectPropModelArray<Obj extends Object, Field extends keyof Obj>(objArray: Obj[], field: Field) {
    const modelArray = ref<Array<Obj[Field]>>(objArray.map((item) => item[field]))
    watch(
        modelArray,
        (newValueArray) => {
            for (const [index, newValue] of newValueArray.entries()) {
                const oldValue = objArray[index][field]
                if (newValue !== oldValue) {
                    // @ts-expect-error
                    objArray[index][field] = newValue
                }
            }
        },
        {deep: true},
    )
    return modelArray
}
