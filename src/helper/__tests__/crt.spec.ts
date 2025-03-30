import {describe, expect, it} from 'vitest'

import {generalizedCrt} from '../crt'

describe('crt', () => {
    it('throws an error if lengths of arrays don\'t match', () => {
        expect(() => generalizedCrt([1, 2], [3, 4, 5])).toThrowError()
        expect(() => generalizedCrt([1, 2, 3], [3, 4, 5])).not.toThrowError()
    })

    it('calculates the correct step', () => {
        expect(generalizedCrt([2, 3, 2], [3, 5, 7])).toBe(23)
        expect(generalizedCrt([2, 3, 2], [3, 4, 5])).toBe(47)
        expect(generalizedCrt([1, 0], [60, 7])).toBe(301)
        expect(generalizedCrt([5, 13], [8, 16])).toBe(13)
    })
})
