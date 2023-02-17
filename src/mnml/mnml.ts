import type {Output} from 'webmidi'
import {WebMidi} from 'webmidi'

const PITCHES = [60, 62, 64, 68, 70]

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
    intervalId = 0
    private _output: Output | null | undefined

    // eslint-disable-next-line unicorn/consistent-function-scoping
    private _tracks = [8, 16, 17, 18, 19].map((length) => {
        return Array.from({length}, () => false)
    })
    // eslint-disable-next-line unicorn/consistent-function-scoping
    private _indexes = Array.from({length: this._tracks.length}, () => 0)

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

    public get tracks(): readonly boolean[][] {
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

        for (let trackIndex = 0; trackIndex < this._indexes.length; trackIndex++) {
            const segmentIndex = this._indexes[trackIndex]
            if (this._tracks[trackIndex][segmentIndex]) {
                this._output.channels[trackIndex + 1].playNote(PITCHES[trackIndex])
            }
            else {
                this._output.channels[trackIndex + 1].sendAllNotesOff()
            }
            this._indexes[trackIndex] = (segmentIndex + 1) % this._tracks[trackIndex].length
        }
    }

    public toggleNote(track: number, segment: number): void {
        this._tracks[track][segment] = !this._tracks[track][segment]
    }
}
