import {debounce} from 'throttle-debounce'

import type {PitchIndex} from '@/mnml/mnml-const'
import {COLORS} from '@/mnml/mnml-const'

import type {Mnml} from './mnml'

const MIN_RADIUS_RELATIVE = 0.3

// Notes:
// . think about scaling canvas to avoid conversion on events (follow MDN-Link in resize-function)

export class MnmlInterface {
    canvas
    context
    center!: {
        x: number
        y: number
    }
    radii!: number[]
    angles!: number[]
    running = false

    mnml: Mnml

    debouncedResize!: VoidFunction

    constructor(canvas: HTMLCanvasElement, mnml: Mnml) {
        if (!canvas || !canvas.getContext) {
            throw new Error('Canvas not useable')
        }
        this.mnml = mnml
        this.canvas = canvas
        const context = canvas.getContext('2d')
        if (!context) {
            throw new Error('Context not useable')
        }
        this.context = context
        this.setResizeListener()
        this.handleResize()
    }

    private setResizeListener(): void {
        this.debouncedResize = debounce(1000, this.handleResize.bind(this))
        window.addEventListener('resize', this.debouncedResize)
    }

    destroy(): void {
        this.stopDrawing()
        window.removeEventListener('resize', this.debouncedResize)
    }

    private handleResize(): void {
        this.calculateCanvasSize()
        this.calculateTracks()
    }

    private calculateCanvasSize(): void {
        const canvas = this.canvas
        // taken from: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#scaling_for_high_resolution_displays
        const dpr = window.devicePixelRatio
        canvas.style.width = '100%'
        canvas.style.height = '100%'
        const rect = canvas.getBoundingClientRect()

        // Set the "actual" size of the canvas
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr

        // Set the "drawn" size of the canvas
        canvas.style.width = `${rect.width}px`
        canvas.style.height = `${rect.height}px`
    }

    private calculateTracks(): void {
        const x = this.canvas.width / 2
        const y = this.canvas.height / 2
        this.center = {x, y}
        const maxRadius = Math.min(x, y)
        const minRadius = maxRadius * MIN_RADIUS_RELATIVE
        const tracks = this.mnml.tracks
        const trackWidth = (maxRadius - minRadius) / tracks.length

        this.radii = Array.from({length: tracks.length + 1}, (_, index) => {
            return minRadius + index * trackWidth
        })

        this.angles = Array.from({length: tracks.length}, (_, index) => {
            return (2 * Math.PI) / tracks[index].length
        })
    }

    public startDrawing(): void {
        this.running = true
        window.requestAnimationFrame(this.draw.bind(this))
    }

    public stopDrawing(): void {
        this.running = false
    }

    private draw(): void {
        this.context.save()
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        // this.context.resetTransform()
        this.context.translate(this.center.x, this.center.y)
        this.context.rotate(-Math.PI / 2)
        const trackCount = this.mnml.tracks.length
        for (let index = 0; index < trackCount; index++) {
            this.drawTrack(index)
        }
        this.context.restore()
        if (this.running) {
            window.requestAnimationFrame(this.draw.bind(this))
        }
    }

    private drawTrack(trackNumber: number): void {
        const track = this.mnml.tracks[trackNumber]
        const segmentCount = track.length
        const angle = (2 * Math.PI) / segmentCount
        const innerRadius = this.radii[trackNumber]
        const outerRadius = this.radii[trackNumber + 1]
        this.context.save()
        const segment = this.createSegment(innerRadius, outerRadius, angle)
        const indexes = this.mnml.indexes
        for (let index = 0; index < segmentCount; index++) {
            const pitchIndex = track[index]
            const selected = pitchIndex !== false
            if (index === indexes[trackNumber]) {
                this.context.fillStyle = selected
                    ? `rgb(${COLORS[pitchIndex]})`
                    : 'rgb(80, 80, 80)'
            }
            else {
                this.context.fillStyle = selected
                    ? `rgba(${COLORS[pitchIndex]}, 0.5)`
                    : 'rgb(255, 255, 255)'
            }
            this.context.fill(segment)
            this.context.stroke(segment)
            this.context.rotate(angle)
        }
        this.context.restore()
    }

    private createSegment(innerRadius: number, outerRadius: number, angle: number): Path2D {
        const segment = new Path2D()
        segment.moveTo(innerRadius, 0)
        segment.arc(0, 0, outerRadius, 0, angle)
        segment.arc(0, 0, innerRadius, angle, 0, true)
        return segment
    }

    public clicked(x: number, y: number, pitchIndex: PitchIndex): void {
        if (0 > pitchIndex || pitchIndex >= 5) {
            return
        }
        const rect = this.canvas.getBoundingClientRect()
        x = x - rect.width / 2
        y = y - rect.height / 2
        const radius = Math.sqrt(x * x + y * y) * window.devicePixelRatio

        if (this.radii[0] > radius || radius > this.radii[this.radii.length - 1]) {
            return
        }
        let angle = Math.atan2(y, x) + Math.PI / 2
        if (angle < 0) {
            angle += 2 * Math.PI
        }

        const track = this.radii.findIndex((trackInnerRadius) => trackInnerRadius > radius)! - 1
        const segment = Math.floor(angle / this.angles[track])
        this.mnml.toggleNote(track, segment, pitchIndex)
    }
}
