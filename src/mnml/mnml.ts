import type {Output} from 'webmidi'
import {WebMidi} from 'webmidi'

async function initWebmidi(): Promise<Output> {
    await WebMidi.enable()
    const output = WebMidi.outputs[0]
    output.sendAllSoundOff()
    return output
}

const PITCHES = [60, 62, 64, 68, 70]

export class Mnml {
    private static instance: Mnml
    private static output: Output

    // eslint-disable-next-line unicorn/consistent-function-scoping
    private _tracks = [8, 16, 17, 18, 19].map((length) => {
        return Array.from({length}, () => false)
    })
    // eslint-disable-next-line unicorn/consistent-function-scoping
    private _indexes = Array.from({length: this._tracks.length}, () => 0)

    private constructor() {
        Mnml.instance = this
    }

    static async getInstance(): Promise<Mnml> {
        if (Mnml.instance) {
            return Mnml.instance
        }

        if (!WebMidi.enabled) {
            Mnml.output = await initWebmidi()
        }

        new Mnml()
        return Mnml.instance
    }

    public get indexes(): readonly number[] {
        return this._indexes
    }

    public get tracks(): readonly boolean[][] {
        return this._tracks
    }

    intervalId = 0

    start(): void {
        this.intervalId = window.setInterval(this.tick.bind(this), 250)
    }

    stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId)
        }
    }

    private tick(): void {
        for (let trackIndex = 0; trackIndex < this._indexes.length; trackIndex++) {
            const segmentIndex = this._indexes[trackIndex]
            if (this._tracks[trackIndex][segmentIndex]) {
                Mnml.output.channels[trackIndex + 1].playNote(PITCHES[trackIndex])
            }
            else {
                Mnml.output.channels[trackIndex + 1].sendAllNotesOff()
            }
            this._indexes[trackIndex] = (segmentIndex + 1) % this._tracks[trackIndex].length
        }
    }

    public toggleNote(track: number, segment: number): void {
        this._tracks[track][segment] = !this._tracks[track][segment]
    }
}
