export enum MIDI_STATE {
    MIDI_UNAVAILABLE,
    MIDI_NOT_ENABLED,
    NO_OUTPUT_AVAILABLE,
    NO_OUTPUT_SELECTED,
    READY,
    UNKNOWN,
}

export enum MNML_STATE {
    STOPPED,
    PAUSED,
    PLAYING,
}

export const VOICES_MIN = 1
export const VOICES_MAX = 3

export const DEFAULT_TRACK_LENGTH = [8, 16, 17, 18, 19] as const

export type PitchClass = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
export type PitchIndex = 0 | 1 | 2 | 3 | 4

export type PatternStep = PitchIndex | false
export type Pattern = PatternStep[]

export type TemporalInformation = {
    time: number
    duration: number
}

export type PentatonicScale = Readonly<{
    name: string
    pitches: [PitchClass, PitchClass, PitchClass, PitchClass, PitchClass]
}>

// C, C#/Db, D, D#/Eb, E, F, F#/Gb, G, G#/Ab, A, A#/Bb, B
// taken from https://en.wikipedia.org/wiki/Pentatonic_scale#Pentatonic_scales_found_by_running_up_the_keys_C,_D,_E,_G_and_A
export const SCALES: PentatonicScale[] = [
    {name: 'MAJOR', pitches: [0, 2, 4, 7, 9]},
    {name: 'SUSPENDED', pitches: [0, 2, 5, 7, 10]},
    {name: 'BLUES_MINOR', pitches: [0, 3, 5, 8, 10]},
    {name: 'BLUES_MAJOR', pitches: [0, 2, 5, 7, 9]},
    {name: 'MINOR', pitches: [0, 3, 5, 7, 10]},
]

export type Key = Readonly<{
    name: string
    pitch: PitchClass
}>

export const KEYS: Key[] = [
    {name: 'C', pitch: 0},
    {name: 'C#/Db', pitch: 1},
    {name: 'D', pitch: 2},
    {name: 'D#/Eb', pitch: 3},
    {name: 'E', pitch: 4},
    {name: 'F', pitch: 5},
    {name: 'F#/Gb', pitch: 6},
    {name: 'G', pitch: 7},
    {name: 'G#/Ab', pitch: 8},
    {name: 'A', pitch: 9},
    {name: 'A#/Bb', pitch: 10},
    {name: 'B', pitch: 11},
]

export const enum TRIGGER_MODE {
    /** Trigger a note when the step is active. */
    SINGLE,
    /** Ties a note across multiple steps to make a longer sustained note. */
    TIE,
    /** Some sequencers allow "hold mode", where a note continues until another note is triggered or a gate-off is sent. */
    HOLD,
}

export const TRIGGER_MODES = [
    {name: 'SINGLE', value: TRIGGER_MODE.SINGLE},
    {name: 'TIE', value: TRIGGER_MODE.TIE},
    {name: 'HOLD', value: TRIGGER_MODE.HOLD},
    // use?
    // Legato: When steps are connected smoothly without re-triggering the note envelope.
    // Retrigger: Triggers a note multiple times within one step (used for rolls, flams, etc.).
]

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
