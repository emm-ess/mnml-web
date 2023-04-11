import type {Output} from 'webmidi'
import {WebMidi} from 'webmidi'

import {MnmlTicker} from '@/mnml/mnml-ticker'
import {MnmlVoice} from '@/mnml/mnml-voice'

import type {Pattern, PentatonicScale, PitchIndex} from './mnml-const'
import {DEFAULT_TRACK_LENGTH, SCALES} from './mnml-const'

const PITCHES = [60, 36, 48, 60, 72]
const NUM_VOICES = [1, 3, 3, 3, 3]

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
    private _activeVoices = 1
    voicesPerTrack: MnmlVoice[][] = []
    private tickers = [new MnmlTicker(120), new MnmlTicker(140), new MnmlTicker(160)] as const

    // eslint-disable-next-line unicorn/consistent-function-scoping
    private _tracks: (PitchIndex | false)[][] = DEFAULT_TRACK_LENGTH.map((length) => {
        return Array.from({length}, () => false)
    })

    public get output(): Output | null | undefined {
        return this._output
    }

    public set output(output: Output | null | undefined) {
        if (output) {
            localStorage.setItem('mnml.output', output.name)
        }
        this._output = output
    }

    public get tracks(): readonly Pattern[] {
        return this._tracks
    }

    public get activeVoices() {
        return this._activeVoices
    }

    public set activeVoices(voices) {
        this._activeVoices = voices
        this.setActiveVoices()
    }

    constructor() {
        this._output = getLastOutput()

        let outputIndex = 1
        for (const [trackIndex, numberVoicesForTrack] of NUM_VOICES.entries()) {
            const voicesOfTrack = []

            for (let index = 0; index < numberVoicesForTrack; index++) {
                const voice = new MnmlVoice(this._tracks[trackIndex], outputIndex, PITCHES[trackIndex], this)
                voicesOfTrack.push(voice)
                this.tickers[index].addTickable(voice)
                outputIndex++
                // channel 10 is used for percussion
                if (outputIndex === 10) {
                    outputIndex++
                }
            }

            this.voicesPerTrack.push(voicesOfTrack)
        }
    }

    private setActiveVoices(): void {
        for (const [index, ticker] of this.tickers.entries()) {
            if (index < this._activeVoices) {
                for (const voice of ticker.tickables) {
                    voice.start()
                }
            }
            else {
                for (const voice of ticker.tickables) {
                    voice.stop()
                }
            }
        }
    }

    start(): void {
        for (const ticker of this.tickers) {
            ticker.start()
        }
        this.setActiveVoices()
    }

    stop(): void {
        for (const ticker of this.tickers) {
            ticker.stop()
        }
    }

    public toggleNote(track: number, segment: number, pitchIndex: PitchIndex | null): void {
        const currentPitchIndex = this._tracks[track][segment]
        this._tracks[track][segment] = currentPitchIndex === pitchIndex || pitchIndex === null
            ? false
            : pitchIndex
    }
}
