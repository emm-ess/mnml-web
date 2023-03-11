import type {MnmlVoice} from '@/mnml/mnml-voice'

export class MnmlTicker {
    private intervalId = 0
    /** in bpm */
    private tempo: number
    tickables: MnmlVoice[]

    constructor(tempo: number, tickables: MnmlVoice[] = []) {
        this.tempo = tempo
        this.tickables = tickables
    }

    addTickable(tickable: MnmlVoice): void {
        if (!this.tickables.includes(tickable)) {
            this.tickables.push(tickable)
        }
    }

    start(): void {
        // do not start again, if already running
        if (this.intervalId) {
            return
        }
        const ms = 60_000 / this.tempo
        this.intervalId = window.setInterval(this.tick.bind(this), ms)
    }

    stop(): void {
        if (this.intervalId) {
            window.clearInterval(this.intervalId)
            this.intervalId = 0
        }
    }

    private tick(): void {
        for (const tickable of this.tickables) {
            tickable.tick()
        }
    }
}
