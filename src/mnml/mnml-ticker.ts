import lcm from 'compute-lcm'

import {generalizedCrt} from '@/helper/crt'
import type {MnmlVoice} from '@/mnml/mnml-voice'

export class MnmlTicker {
    // eslint-disable-next-line sonarjs/public-static-readonly
    static relativeBpmSetting = true

    private intervalId = 0
    private _length = 0
    private _position = 0

    /** in bpm */
    private _bpm = 0
    private _nextBpm = 0
    tickables: MnmlVoice[]

    get bpm(): number {
        return this._bpm
    }

    set bpm(bpm: number) {
        if (bpm === this._bpm) {
            return
        }
        this._nextBpm = bpm
    }

    get length(): number {
        return this._length
    }

    get position(): number {
        return this._position
    }

    get progress(): number {
        return (this._position + 1) / this._length
    }

    get time(): number {
        return Math.round((this._position / this._bpm) * 60)
    }

    get duration(): number {
        return Math.round((this._length / this._bpm) * 60)
    }

    constructor(bpm: number, tickables: MnmlVoice[] = []) {
        this._nextBpm = bpm
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
        this.restart()
    }

    stop(): void {
        if (this.intervalId) {
            window.clearInterval(this.intervalId)
            this.intervalId = 0
        }
    }

    restart(): void {
        if (this.intervalId) {
            window.clearInterval(this.intervalId)
        }
        this._bpm = this._nextBpm
        const ms = 60_000 / this._bpm
        this.intervalId = window.setInterval(this.tick.bind(this), ms)
        this._nextBpm = 0
    }

    private tick(): void {
        for (const tickable of this.tickables) {
            tickable.tick()
        }
        this.updateMetrics()
        if (this._nextBpm) {
            this.restart()
        }
    }

    private updateMetrics(): void {
        const patternLengths: number[] = []
        const positions: number[] = []

        for (const tickable of this.tickables) {
            if (tickable.active && tickable.track.active) {
                patternLengths.push(tickable.pattern.length)
                positions.push(tickable.index)
            }
        }

        this.setLength(patternLengths)
        this.setPosition(positions, patternLengths)
    }

    private setLength(patternLengths: number[]): void {
        switch (patternLengths.length) {
            case 0:
                this._length = 0
                break
            case 1:
                this._length = patternLengths[0]
                break
            default:
                this._length = lcm(patternLengths) as number
                break
        }
    }

    private setPosition(positions: number[], patternLengths: number[]): void {
        switch (positions.length) {
            case 0:
                this._position = 0
                break
            case 1:
                this._position = positions[0]
                break
            default:
                this._position = generalizedCrt(positions, patternLengths) as number
                break
        }
    }
}
