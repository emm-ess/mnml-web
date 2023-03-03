import type {Mnml} from './mnml'
import type {Pattern} from './mnml-const'

export class MnmlVoice {
    pattern: Pattern
    index: number = 0
    basePitch: number
    mnml: Mnml
    outputIndex: number

    constructor(pattern: Pattern, outputIndex: number, basePitch: number, mnml: Mnml) {
        this.pattern = pattern
        this.outputIndex = outputIndex
        this.basePitch = basePitch
        this.mnml = mnml
    }

    public tick() {
        const pitchIndex = this.pattern[this.index]
        const channel = this.mnml.output!.channels[this.outputIndex]
        if (pitchIndex === false) {
            channel.sendAllNotesOff()
        }
        else {
            const pitch = this.basePitch + this.mnml.scale.pitches[pitchIndex]
            channel.playNote(pitch)
        }
        this.index = (this.index + 1) % this.pattern.length
    }
}
