import type {OutputChannel} from 'webmidi'

import {GENERAL_MIDI_CC} from '@/helper/general-midi'
import type {MnmlTrack} from '@/mnml/mnml-track'

import type {Mnml} from './mnml'
import type {Pattern} from './mnml-const'

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

    constructor(track: MnmlTrack, channelNumber: number, mnml: Mnml) {
        this.track = track
        this.pattern = track.pattern
        this.mnml = mnml
        this.channelNumber = channelNumber
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
            if (pitchIndex === false) {
                this.channel.sendAllNotesOff()
            }
            else {
                const pitch = this.track.basePitch + this.mnml.scale.pitches[pitchIndex]
                this.channel.playNote(pitch)
            }
        }
    }
}
