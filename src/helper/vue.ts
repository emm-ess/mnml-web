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

export function displayDuration(duration: number): string {
    // 604_800 = 86_400 * 7
    const weeks = Math.floor(duration / 604_800)
    duration -= weeks * 604_800
    // 86_400 = 24 * 3_600
    const days = Math.floor(duration / 86_400)
    duration -= days * 86_400
    const hours = Math.floor(duration / 3600)
    duration -= hours * 3600
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    // if (Intl.DurationFormat) {
    //     return new Intl.DurationFormat('de', {style: 'narrow'}).format({
    //         weeks, days, hours, minutes, seconds,
    //     })
    // }
    return `${weeks}w ${days}d ${hours}h ${minutes}m ${seconds}s`
}
