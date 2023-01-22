import {debounce} from 'throttle-debounce'

const MIN_RADIUS_RELATIVE = 0.3
const TRACKS = [8, 16, 17, 18, 19].map((length) => {
    return Array.from({length}, () => false)
})
const CUR_INDEXES = Array.from({length: TRACKS.length}, () => 0)

// Notes:
// . think about scaling canvas to avoid conversion on events (follow MDN-Link in resize-function)

class StepFaker {
    intervalId = 0

    start(): void {
        this.intervalId = window.setInterval(this.tick.bind(this), 250)
    }

    stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId)
        }
    }

    private tick(): void {
        for (let index = 0; index < CUR_INDEXES.length; index++) {
            CUR_INDEXES[index] = (CUR_INDEXES[index] + 1) % TRACKS[index].length
        }
    }
}
const faker = new StepFaker()

export class MnmlRenderer {
    canvas
    context
    center!: {
        x: number
        y: number
    }
    radii!: number[]
    angles!: number[]
    running = false

    debouncedResize!: VoidFunction

    constructor(canvas: HTMLCanvasElement) {
        if (!canvas || !canvas.getContext) {
            throw new Error('Canvas not useable')
        }
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
        const trackWidth = (maxRadius - minRadius) / TRACKS.length

        this.radii = Array.from({length: TRACKS.length + 1}, (_, index) => {
            return minRadius + index * trackWidth
        })

        this.angles = Array.from({length: TRACKS.length}, (_, index) => {
            return (2 * Math.PI) / TRACKS[index].length
        })
    }

    public startDrawing(): void {
        this.running = true
        window.requestAnimationFrame(this.draw.bind(this))
        faker.start()
    }

    public stopDrawing(): void {
        this.running = false
        faker.stop()
    }

    private draw(): void {
        this.context.save()
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        // this.context.resetTransform()
        this.context.translate(this.center.x, this.center.y)
        this.context.rotate(-Math.PI / 2)
        for (let index = 0; index < TRACKS.length; index++) {
            this.drawTrack(index)
        }
        this.context.restore()
        if (this.running) {
            window.requestAnimationFrame(this.draw.bind(this))
        }
    }

    private drawTrack(trackNumber: number): void {
        const segmentCount = TRACKS[trackNumber].length
        const angle = (2 * Math.PI) / segmentCount
        const innerRadius = this.radii[trackNumber]
        const outerRadius = this.radii[trackNumber + 1]
        this.context.save()
        const segment = this.createSegment(innerRadius, outerRadius, angle)
        for (let index = 0; index < segmentCount; index++) {
            const selected = TRACKS[trackNumber][index]
            if (index === CUR_INDEXES[trackNumber]) {
                this.context.fillStyle = selected
                    ? 'rgb(0, 0, 0)'
                    : 'rgb(80, 80, 80)'
            }
            else {
                this.context.fillStyle = selected
                    ? 'rgb(127, 127, 127)'
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

    public clicked(x: number, y: number): void {
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
        TRACKS[track][segment] = !TRACKS[track][segment]
    }
}
