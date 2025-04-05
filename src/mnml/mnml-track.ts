import type {Mnml} from '@/mnml/mnml.ts'
import {type PitchIndex, TRIGGER_MODE} from '@/mnml/mnml-const'
import type {MnmlVoice} from '@/mnml/mnml-voice'

type MnmlTrackOptions = {
    length: number
    octave: number
    midiProgram: number
}

export class MnmlTrack {
    private readonly mnml: Mnml
    pattern: (PitchIndex | false)[]
    _triggerMode = TRIGGER_MODE.SINGLE
    voices: MnmlVoice[] = []
    _basePitch!: number
    _octave!: number
    private _midiProgram!: number

    get midiProgram(): number {
        return this._midiProgram
    }

    set midiProgram(value: number) {
        this._midiProgram = value
        for (const voice of this.voices) {
            voice.channel.sendProgramChange(value)
        }
    }

    get octave(): number {
        return this._octave
    }

    set octave(value: number) {
        this._octave = value
        this.update()
    }

    get basePitch() {
        return this._basePitch
    }

    get active(): boolean {
        return this.pattern.some((step) => step !== false)
    }

    get triggerMode(): TRIGGER_MODE {
        return this._triggerMode
    }

    set triggerMode(triggerMode: TRIGGER_MODE) {
        this._triggerMode = triggerMode
        for (const voice of this.voices) {
            voice.changeTriggerMode(triggerMode)
        }
    }

    constructor(mnml: Mnml, options: MnmlTrackOptions) {
        this.mnml = mnml
        this.pattern = Array.from({length: options.length}, () => false)
        this.octave = options.octave
        this.midiProgram = options.midiProgram
    }

    // ToDo: introduce reactivity?
    public update(): void {
        this._basePitch = this._octave * 12 + this.mnml.key
    }

    public registerVoice(voice: MnmlVoice): void {
        this.voices.push(voice)
        voice.channel.sendProgramChange(this._midiProgram)
    }
}
