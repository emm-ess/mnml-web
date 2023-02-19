export enum MNML_STATE {
    MIDI_UNAVAILABLE,
    MIDI_NOT_ENABLED,
    NO_OUTPUT_AVAILABLE,
    NO_OUTPUT_SELECTED,
    READY,
    PLAYING,
    PAUSED,
    UNKNOWN,
}

export const DEFAULT_TRACK_LENGTH = [8, 16, 17, 18, 19] as const

export type PitchIndex = 0 | 1 | 2 | 3 | 4

export type PENTATONIC_SCALE = Readonly<[number, number, number, number, number]>

// C, C#/Db, D, D#/Eb, E, F, F#/Gb, G, G#/Ab, A, A#/Bb, B
// taken from https://en.wikipedia.org/wiki/Pentatonic_scale#Pentatonic_scales_found_by_running_up_the_keys_C,_D,_E,_G_and_A
export const SCALES: Record<string, PENTATONIC_SCALE> = {
    MAJOR: [0, 2, 4, 7, 9],
    SUSPENDED: [0, 2, 5, 7, 10],
    BLUES_MINOR: [0, 3, 5, 8, 10],
    BLUES_MAJOR: [0, 2, 5, 7, 9],
    MINOR: [0, 3, 5, 7, 10],
} as const

function hexToRgb(hex: `#${string}`): string {
    const result = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex)!
    return [Number.parseInt(result[1], 16), Number.parseInt(result[2], 16), Number.parseInt(result[3], 16)].join(',')
}

export const COLORS = [
    hexToRgb('#333333'),
    hexToRgb('#C7162B'),
    hexToRgb('#F99B11'),
    hexToRgb('#0E8420'),
    hexToRgb('#24598F'),
]
