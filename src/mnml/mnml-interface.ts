import {debounce} from 'throttle-debounce'

import type {Mnml} from './mnml'
import type {PitchIndex} from './mnml-const'
import {COLORS, VOICES_MAX, VOICES_MIN} from './mnml-const'
import type {MnmlVoice} from './mnml-voice'

const MIN_RADIUS_RELATIVE = 0.2
const INNER_CIRCLE_RELATIVE_RADIUS = 0.618
const SPACE_BETWEEN_TRACKS = 12
const SPACE_BETWEEN_TRACKS_HALF = SPACE_BETWEEN_TRACKS / 2
const SPACE_BETWEEN_VOICES = 4

// Notes:
// . think about scaling canvas to avoid conversion on events (follow MDN-Link in resize-function)

type TrackRenderInfo = {
    innerRadius: number
    angle: number
    segments: [[Path2D], [Path2D, Path2D], [Path2D, Path2D, Path2D]]
}

export class MnmlInterface {
    canvas
    context
    center!: {
        x: number
        y: number
    }

    trackRenderInfos!: TrackRenderInfo[]
    maxRadius!: number

    running = false

    mnml: Mnml

    debouncedResize!: VoidFunction

    constructor(canvas: HTMLCanvasElement, mnml: Mnml) {
        if (!canvas?.getContext) {
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
        const maxRadius = (this.maxRadius = Math.min(x, y))
        const minRadius = maxRadius * MIN_RADIUS_RELATIVE
        const tracks = this.mnml.tracks
        const innerCircleOuterRadius
            = minRadius + ((maxRadius - minRadius) / tracks.length) * INNER_CIRCLE_RELATIVE_RADIUS
        const baseTrackWidth = (maxRadius - innerCircleOuterRadius) / (tracks.length - 1)
        const voiceArray = Array.from({length: VOICES_MAX - VOICES_MIN + 1}, (_, index) => {
            return index + 1
        })

        const voiceWidths = voiceArray.map((voice) => {
            return (baseTrackWidth - SPACE_BETWEEN_TRACKS - SPACE_BETWEEN_VOICES * (voice - 1)) / voice
        })

        this.trackRenderInfos = [
            MnmlInterface.getInnerTrackRenderInfo(
                tracks[0].length,
                minRadius,
                innerCircleOuterRadius - SPACE_BETWEEN_TRACKS_HALF,
            ),
        ]

        for (let trackIndex = 1; trackIndex < tracks.length; trackIndex++) {
            const angle = (2 * Math.PI) / tracks[trackIndex].length
            const trackBaseRadius
                = innerCircleOuterRadius + baseTrackWidth * (trackIndex - 1) + SPACE_BETWEEN_TRACKS_HALF
            const segments = voiceArray.map((voice) => {
                const segments: Path2D[] = []
                for (let voiceIndex = 0; voiceIndex < voice; voiceIndex++) {
                    const innerRadius
                        = trackBaseRadius + voiceWidths[voice - 1] * voiceIndex + SPACE_BETWEEN_VOICES * voiceIndex
                    const outerRadius = innerRadius + voiceWidths[voice - 1]
                    const segment = MnmlInterface.createSegment(innerRadius, outerRadius, angle * 0.98)
                    segments.push(segment)
                }
                return segments
            }) as TrackRenderInfo['segments']
            this.trackRenderInfos.push({angle, innerRadius: trackBaseRadius, segments})
        }
    }

    private static getInnerTrackRenderInfo(
        segmentCount: number,
        minRadius: number,
        innerCircleOuterRadius: number,
    ): TrackRenderInfo {
        const angle = (2 * Math.PI) / segmentCount
        const segment = MnmlInterface.createSegment(minRadius, innerCircleOuterRadius - 2, angle * 0.98)
        return {
            innerRadius: minRadius,
            angle,
            segments: [[segment], [segment, segment], [segment, segment, segment]],
        }
    }

    private static createSegment(innerRadius: number, outerRadius: number, angle: number): Path2D {
        const segment = new Path2D()
        segment.moveTo(innerRadius, 0)
        segment.arc(0, 0, outerRadius, 0, angle)
        segment.arc(0, 0, innerRadius, angle, 0, true)
        return segment
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
        const track = this.mnml.voicesPerTrack[trackNumber]
        const renderInfo = this.trackRenderInfos[trackNumber]
        const angle = renderInfo.angle

        const activeVoices = track.reduce((sum, voice, index) => {
            if (voice.active || index === 0) {
                sum++
            }
            return sum
        }, -1)
        const segmentInfo = renderInfo.segments[activeVoices]
        let activeVoiceIndex = 0
        for (const [index, voice] of track.entries()) {
            if (voice.active || index === 0) {
                const segment = segmentInfo[activeVoiceIndex]
                this.drawVoice(voice, angle, segment)
                activeVoiceIndex++
            }
        }
    }

    private drawVoice(voice: MnmlVoice, angle: number, segment: Path2D): void {
        this.context.save()
        const pattern = voice.pattern
        const currentIndex = voice.index
        for (const [index, pitchIndex] of pattern.entries()) {
            const selected = pitchIndex !== false
            if (index === currentIndex) {
                this.context.fillStyle = selected
                    ? `rgb(${COLORS[pitchIndex]})`
                    : 'rgb(80, 80, 80)'
            }
            else {
                this.context.fillStyle = selected
                    ? `rgba(${COLORS[pitchIndex]}, 0.5)`
                    : 'rgb(220, 220, 220)'
            }
            this.context.fill(segment)
            this.context.rotate(angle)
        }
        this.context.restore()
    }

    public clicked(x: number, y: number, pitchIndex: PitchIndex | null): void {
        if (pitchIndex !== null && (pitchIndex < 0 || pitchIndex >= 5)) {
            return
        }
        const rect = this.canvas.getBoundingClientRect()
        x = x - rect.width / 2
        y = y - rect.height / 2
        const radius = Math.sqrt(x * x + y * y) * window.devicePixelRatio

        if (this.trackRenderInfos[0].innerRadius > radius || radius > this.maxRadius) {
            return
        }
        let angle = Math.atan2(y, x) + Math.PI / 2
        if (angle < 0) {
            angle += 2 * Math.PI
        }

        let track = this.trackRenderInfos.findIndex((trackRenderInfo) => trackRenderInfo.innerRadius > radius) - 1
        if (track < 0) {
            track = this.trackRenderInfos.length - 1
        }
        const segment = Math.floor(angle / this.trackRenderInfos[track].angle)
        this.mnml.toggleNote(track, segment, pitchIndex)
    }
}
