import type {Output} from 'webmidi'
import {WebMidi} from 'webmidi'

import type {PentatonicScale, PitchIndex} from './mnml-const'
import {DEFAULT_TRACK_LENGTH, SCALES} from './mnml-const'

const PITCHES = [60, 36, 48, 60, 72]

function getLastOutput(): Output | undefined {
    if (!WebMidi.enabled) {
        return
    }
    const outputName = localStorage.getItem('mnml.output')
    if (!outputName) {
        return
    }
    return WebMidi.outputs.find((output) => output.name === outputName)
}

export class Mnml {
    private intervalId = 0
    private _output: Output | null | undefined
    scale: PentatonicScale = SCALES[0]

    // eslint-disable-next-line unicorn/consistent-function-scoping
    private _tracks: (PitchIndex | false)[][] = DEFAULT_TRACK_LENGTH.map((length) => {
        return Array.from({length}, () => false)
    })
    // eslint-disable-next-line unicorn/consistent-function-scoping
    private _indexes = Array.from({length: DEFAULT_TRACK_LENGTH.length}, () => 0)

    public get output(): Output | null | undefined {
        return this._output
    }

    public set output(output: Output | null | undefined) {
        if (output) {
            localStorage.setItem('mnml.output', output.name)
        }
        this._output = output
    }

    public get indexes(): readonly number[] {
        return this._indexes
    }

    public get tracks(): readonly (PitchIndex | false)[][] {
        return this._tracks
    }

    constructor() {
        this._output = getLastOutput()
    }

    start(): void {
        this.intervalId = window.setInterval(this.tick.bind(this), 250)
    }

    stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId)
        }
    }

    private tick(): void {
        if (!this._output) {
            return
        }

        const scale = this.scale.pitches

        for (let trackIndex = 0; trackIndex < this._indexes.length; trackIndex++) {
            const segmentIndex = this._indexes[trackIndex]
            const pitchIndex = this._tracks[trackIndex][segmentIndex]
            if (pitchIndex === false) {
                this._output.channels[trackIndex + 1].sendAllNotesOff()
            }
            else {
                const pitch = PITCHES[trackIndex] + scale[pitchIndex]
                this._output.channels[trackIndex + 1].playNote(pitch)
            }
            this._indexes[trackIndex] = (segmentIndex + 1) % this._tracks[trackIndex].length
        }
    }

    public toggleNote(track: number, segment: number, pitchIndex: PitchIndex): void {
        const currentPitchIndex = this._tracks[track][segment]
        this._tracks[track][segment] = currentPitchIndex === pitchIndex
            ? false
            : pitchIndex
    }
}
