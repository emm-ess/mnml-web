import type {PitchIndex} from '@/mnml/mnml-const'
import type {MnmlVoice} from '@/mnml/mnml-voice'

export class MnmlTrack {
    pattern: (PitchIndex | false)[]
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
        this._basePitch = value * 12
    }

    get basePitch() {
        return this._basePitch
    }

    constructor(patternLength: number, octave: number, midiProgram: number) {
        this.pattern = Array.from({length: patternLength}, () => false)
        this.octave = octave
        this.midiProgram = midiProgram
    }

    public registerVoice(voice: MnmlVoice): void {
        this.voices.push(voice)
        voice.channel.sendProgramChange(this._midiProgram)
    }
}
