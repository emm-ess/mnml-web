import lcm from 'compute-lcm'
import type {Output} from 'webmidi'
import {WebMidi} from 'webmidi'

import {generalizedCrt} from '@/helper/crt'

import {MNML_STATE, type Pattern, type PentatonicScale, type PitchIndex, type TemporalInformation} from './mnml-const'
import {DEFAULT_TRACK_LENGTH, MIDI_STATE, SCALES} from './mnml-const'
import {MnmlTicker} from './mnml-ticker'
import {MnmlTrack} from './mnml-track'
import {MnmlVoice} from './mnml-voice'

const OCTAVES = [5, 3, 4, 5, 6]
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
    static async enableWebMidi(): Promise<void> {
        if (!WebMidi.enabled) {
            await WebMidi.enable()
        }
    }

    private _output: Output | null | undefined
    private _midiState = MIDI_STATE.UNKNOWN
    state = MNML_STATE.STOPPED
    scale: PentatonicScale = SCALES[0]
    private _activeVoices = 1
    readonly tickers = [new MnmlTicker(120), new MnmlTicker(140), new MnmlTicker(160)] as const

    public readonly tracks: MnmlTrack[] = DEFAULT_TRACK_LENGTH.map((length, index) => {
        return new MnmlTrack(length, OCTAVES[index], 1)
    })

    public get output(): Output | null | undefined {
        return this._output
    }

    public set output(output: Output | null | undefined) {
        if (this._output && this._output !== output) {
            this._output.sendAllNotesOff().clear()
        }
        if (output) {
            localStorage.setItem('mnml.output', output.name)
        }
        this._output = output
        this.updateMidiState()
    }

    public get patterns(): readonly Pattern[] {
        return this.tracks.map((track) => track.pattern)
    }

    public get activeVoices() {
        return this._activeVoices
    }

    public set activeVoices(voices) {
        this._activeVoices = voices
        this.setActiveVoices()
    }

    public get activeTicker(): MnmlTicker[] {
        return this.tickers.filter((ticker) => ticker.length > 0)
    }

    public get midiState(): MIDI_STATE {
        return this._midiState
    }

    public get voices(): MnmlVoice[] {
        return this.tracks.flatMap((track) => track.voices)
    }

    /** that's not really working and shouldn't be used */
    public get temporalInformation(): TemporalInformation {
        const activeTicker = this.activeTicker
        switch (activeTicker.length) {
            case 0:
                return {
                    time: 0,
                    duration: 0,
                }
            case 1:
                return activeTicker[0]
            default: {
                const {times, durations} = activeTicker.reduce<{
                    times: number[]
                    durations: number[]
                }>(
                    (summed, ticker) => {
                        summed.times.push(ticker.time)
                        summed.durations.push(ticker.duration)
                        return summed
                    },
                    {
                        times: [],
                        durations: [],
                    },
                )
                const time = generalizedCrt(times, durations) as number
                return {
                    time,
                    duration: lcm(durations) as number,
                }
            }
        }
    }

    /** it's based on `temporalInformation` which isn't working, so neither is this */
    public get progress(): number {
        const temporalInformation = this.temporalInformation
        return temporalInformation.time / temporalInformation.duration
    }

    constructor() {
        this._output = getLastOutput()

        let outputIndex = 1
        for (const [trackIndex, numberVoicesForTrack] of NUM_VOICES.entries()) {
            const track = this.tracks[trackIndex]

            for (let index = 0; index < numberVoicesForTrack; index++) {
                const voice = new MnmlVoice(track, outputIndex, this)
                track.registerVoice(voice)
                this.tickers[index].addTickable(voice)
                outputIndex++
                // channel 10 is used for percussion
                if (outputIndex === 10) {
                    outputIndex++
                }
            }
        }
        this.updateMidiState()
    }

    private updateMidiState(): void {
        let newState
        // @ts-ignore
        if (!navigator.requestMIDIAccess) {
            newState = MIDI_STATE.MIDI_UNAVAILABLE
        }
        else if (!WebMidi.enabled) {
            newState = MIDI_STATE.MIDI_NOT_ENABLED
        }
        else if (WebMidi.outputs.length === 0) {
            newState = MIDI_STATE.NO_OUTPUT_AVAILABLE
        }
        else if (this.output) {
            newState = MIDI_STATE.READY
        }
        else {
            newState = MIDI_STATE.NO_OUTPUT_SELECTED
        }
        this._midiState = newState
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
                    voice.end()
                }
            }
        }
    }

    public start(): void {
        for (const ticker of this.tickers) {
            ticker.start()
        }
        this.setActiveVoices()
        this.state = MNML_STATE.PLAYING
    }

    public restart(): void {
        for (const voice of this.voices) {
            voice.restart()
        }
    }

    public stop(): void {
        for (const ticker of this.tickers) {
            ticker.stop()
        }
        for (const voice of this.voices) {
            voice.stop()
        }
        this.state = MNML_STATE.STOPPED
    }

    public pause(): void {
        for (const ticker of this.tickers) {
            ticker.stop()
        }
        this.state = MNML_STATE.PAUSED
    }

    public clear(): void {
        for (const track of this.patterns) {
            track.fill(false)
        }
    }

    public toggleNote(track: number, segment: number, pitchIndex: PitchIndex | null): void {
        const currentPitchIndex = this.patterns[track][segment]
        this.patterns[track][segment] = currentPitchIndex === pitchIndex || pitchIndex === null
            ? false
            : pitchIndex
    }

    public randomFill(): void {
        for (const pattern of this.patterns) {
            for (let index = 0; index < pattern.length; index++) {
                // eslint-disable-next-line sonarjs/pseudo-random
                const note = Math.round(Math.random() * 6)
                pattern[index] = note < 5
                    ? (note as PitchIndex)
                    : false
            }
        }
    }
}
