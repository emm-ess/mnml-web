import type {OutputChannel} from 'webmidi'

import {GENERAL_MIDI_CC} from '@/helper/general-midi'
import type {MnmlTrack} from '@/mnml/mnml-track'

import type {Mnml} from './mnml'
import {type Pattern, type PatternStep, TRIGGER_MODE} from './mnml-const'

export class MnmlVoice {
    track: MnmlTrack
    pattern: Pattern
    index: number = 0
    _volume = 127
    _pan = 63
    mnml: Mnml
    active = false
    shouldStop = false
    channel!: OutputChannel
    private lastPlayedPitchIndex: PatternStep = false
    private play!: (pitchIndex: PatternStep) => void

    get channelNumber(): number {
        return this.channel.number
    }

    set channelNumber(value: number) {
        this.channel = this.mnml.output!.channels[value]
        this.sendChannelSettings()
    }

    get volume(): number {
        return this._volume
    }

    set volume(value: number) {
        this._volume = value
        this.channel.sendControlChange(GENERAL_MIDI_CC.ChannelVolume, value)
    }

    get pan(): number {
        return this._pan - 63
    }

    set pan(value: number) {
        value += 63
        this._pan = value
        this.channel.sendControlChange(GENERAL_MIDI_CC.ChannelPan, value)
    }

    changeTriggerMode(triggerMode: TRIGGER_MODE) {
        switch (triggerMode) {
            case TRIGGER_MODE.SINGLE:
                this.play = this.playSingle.bind(this)
                break
            case TRIGGER_MODE.TIE:
                this.play = this.playTie.bind(this)
                break
            case TRIGGER_MODE.HOLD:
                this.play = this.playHold.bind(this)
                break
        }
    }

    constructor(track: MnmlTrack, channelNumber: number, mnml: Mnml) {
        this.track = track
        this.pattern = track.pattern
        this.mnml = mnml
        this.channelNumber = channelNumber
        this.changeTriggerMode(track.triggerMode)
    }

    private sendChannelSettings(): void {
        this.channel.sendControlChange(GENERAL_MIDI_CC.ChannelVolume, this._volume)
        this.channel.sendControlChange(GENERAL_MIDI_CC.ChannelPan, this._pan)
    }

    public start() {
        this.active = true
        this.shouldStop = false
    }

    public stop() {
        this.active = false
        this.index = 0
        this.channel.sendAllNotesOff()
    }

    public end() {
        this.shouldStop = true
    }

    public restart() {
        this.index = 0
    }

    public tick() {
        if (this.active) {
            this.index = (this.index + 1) % this.pattern.length
            if (this.shouldStop && this.index === 0) {
                this.active = false
                return
            }

            const pitchIndex = this.pattern[this.index]
            this.play(pitchIndex)
        }
    }

    private playSingle(pitchIndex: PatternStep): void {
        this.channel.sendAllNotesOff()
        if (pitchIndex !== false) {
            this.sendPitch(pitchIndex)
        }
    }

    private playHold(pitchIndex: PatternStep): void {
        if (pitchIndex !== false) {
            this.channel.sendAllNotesOff()
            this.sendPitch(pitchIndex)
        }
    }

    private playTie(pitchIndex: PatternStep): void {
        if (pitchIndex === false || pitchIndex !== this.lastPlayedPitchIndex) {
            this.channel.sendAllNotesOff()

            if (pitchIndex !== false) {
                this.sendPitch(pitchIndex)
            }
            else {
                this.lastPlayedPitchIndex = false
            }
        }
    }

    private sendPitch(pitchIndex: Exclude<PatternStep, false>): void {
        const pitch = this.track.basePitch + this.mnml.scale.pitches[pitchIndex]
        this.channel.playNote(pitch)
        this.lastPlayedPitchIndex = pitchIndex
    }
}
