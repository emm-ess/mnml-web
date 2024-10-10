import type {Mnml} from './mnml'
import type {Pattern} from './mnml-const'

export class MnmlVoice {
    pattern: Pattern
    index: number = 0
    basePitch: number
    mnml: Mnml
    outputIndex: number
    active = false
    shouldStop = false

    constructor(pattern: Pattern, outputIndex: number, basePitch: number, mnml: Mnml) {
        this.pattern = pattern
        this.outputIndex = outputIndex
        this.basePitch = basePitch
        this.mnml = mnml
    }

    public start() {
        this.active = true
        this.shouldStop = false
    }

    public stop() {
        this.active = false
        this.index = 0
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
            const channel = this.mnml.output!.channels[this.outputIndex]
            if (pitchIndex === false) {
                channel.sendAllNotesOff()
            }
            else {
                const pitch = this.basePitch + this.mnml.scale.pitches[pitchIndex]
                channel.playNote(pitch)
            }
        }
    }
}
