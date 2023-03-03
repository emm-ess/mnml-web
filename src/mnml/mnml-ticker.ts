export type Tickable = {
    tick: VoidFunction
}

export class MnmlTicker {
    intervalId = 0
    /** in bpm */
    tempo: number
    tickables: Tickable[]

    constructor(tempo: number, tickables: Tickable[] = []) {
        this.tempo = tempo
        this.tickables = tickables
    }

    addTickable(tickable: Tickable): void {
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

    tick(): void {
        for (const tickable of this.tickables) {
            tickable.tick()
        }
    }
}
