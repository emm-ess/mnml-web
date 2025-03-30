import {debounce} from 'throttle-debounce'

import type {UniformTuple} from '@/helper/types'

import type {Mnml} from './mnml'
import type {PitchIndex} from './mnml-const'
import {COLORS, VOICES_MAX, VOICES_MIN} from './mnml-const'
import type {MnmlVoice} from './mnml-voice'

const PROGRESS_INNER_RADIUS = 0.15
const PROGRESS_GAP = 0.08
const MIN_RADIUS_RELATIVE = 0.2
const INNER_CIRCLE_RELATIVE_RADIUS = 0.618
const SPACE_BETWEEN_TRACKS = 12
const SPACE_BETWEEN_TRACKS_HALF = SPACE_BETWEEN_TRACKS / 2
const SPACE_BETWEEN_VOICES = 4

// Notes:
// . think about scaling canvas to avoid conversion on events (follow MDN-Link in resize-function)

type TrackBasedCachedInfo<T> = [UniformTuple<1, T>, UniformTuple<2, T>, UniformTuple<3, T>]

type TrackRenderInfo = {
    innerRadius: number
    angle: number
    segments: TrackBasedCachedInfo<Path2D>
}

type ProgressRenderInfo = {
    radii: number[]
    stroke: number
}

export class MnmlInterface {
    canvas
    context
    center!: {
        x: number
        y: number
    }

    progressRenderInfos!: UniformTuple<3, ProgressRenderInfo>
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
        this.calculateProgressRenderInfos()
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

        const x = this.canvas.width / 2
        const y = this.canvas.height / 2
        this.center = {x, y}
        this.maxRadius = Math.min(x, y)
    }

    private calculateTracks(): void {
        const maxRadius = this.maxRadius
        const minRadius = maxRadius * MIN_RADIUS_RELATIVE
        const patterns = this.mnml.patterns
        const innerCircleOuterRadius
            = minRadius + ((maxRadius - minRadius) / patterns.length) * INNER_CIRCLE_RELATIVE_RADIUS
        const baseTrackWidth = (maxRadius - innerCircleOuterRadius) / (patterns.length - 1)
        const voiceArray = Array.from({length: VOICES_MAX - VOICES_MIN + 1}, (_, index) => {
            return index + 1
        })

        const voiceWidths = voiceArray.map((voice) => {
            return (baseTrackWidth - SPACE_BETWEEN_TRACKS - SPACE_BETWEEN_VOICES * (voice - 1)) / voice
        })

        this.trackRenderInfos = [
            MnmlInterface.getInnerTrackRenderInfo(
                patterns[0].length,
                minRadius,
                innerCircleOuterRadius - SPACE_BETWEEN_TRACKS_HALF,
            ),
        ]

        for (let trackIndex = 1; trackIndex < patterns.length; trackIndex++) {
            const angle = (2 * Math.PI) / patterns[trackIndex].length
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

    private calculateProgressRenderInfos(): void {
        const getProgressRenderInfo = (
            tracks: 1 | 2 | 3,
            usableWidth: number,
            offset = 0,
            gap = 0,
        ): ProgressRenderInfo => {
            const stroke = (usableWidth - (tracks - 1) * gap) / tracks
            return {
                radii: Array.from({length: tracks}, (_, i) => {
                    return (PROGRESS_INNER_RADIUS + offset + i * (stroke + gap) + stroke / 2) * this.maxRadius
                }),
                stroke: stroke * this.maxRadius,
            }
        }

        const baseStroke = MIN_RADIUS_RELATIVE - PROGRESS_INNER_RADIUS
        const gap = PROGRESS_GAP * baseStroke
        const outerGap = 2 * gap
        const usableWidth = baseStroke - 4 * gap

        this.progressRenderInfos = [
            getProgressRenderInfo(1, baseStroke),
            getProgressRenderInfo(2, usableWidth, outerGap, gap),
            getProgressRenderInfo(3, usableWidth, outerGap, gap),
        ]
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
        for (let index = 0; index < this.mnml.tracks.length; index++) {
            this.drawTrack(index)
        }
        this.drawProgress()
        this.context.restore()
        if (this.running) {
            window.requestAnimationFrame(this.draw.bind(this))
        }
    }

    private drawTrack(trackNumber: number): void {
        const voices = this.mnml.tracks[trackNumber].voices
        const renderInfo = this.trackRenderInfos[trackNumber]
        const angle = renderInfo.angle

        const activeVoices = voices.reduce((sum, voice, index) => {
            if (voice.active || index === 0) {
                sum++
            }
            return sum
        }, -1)
        const segmentInfo = renderInfo.segments[activeVoices]
        let activeVoiceIndex = 0
        for (const [index, voice] of voices.entries()) {
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

    private drawProgress(): void {
        const activeTicker = this.mnml.activeTicker
        switch (activeTicker.length) {
            case 0:
                return
            case 1: {
                const renderInfo = this.progressRenderInfos[0]
                this.drawProgressBar(activeTicker[0].progress, renderInfo.radii[0], renderInfo.stroke)
                break
            }
            default: {
                const renderInfo = this.progressRenderInfos[activeTicker.length - 1]
                activeTicker.forEach((ticker, index) => {
                    this.drawProgressBar(ticker.progress, renderInfo.radii[index], renderInfo.stroke)
                })
                // this would be the total progress, but since it's calculation is not working, there is no need to display it
                // this.drawProgressBar(this.mnml.progress, this.progressRenderInfos[0].radii[0], this.progressRenderInfos[0].stroke)
            }
        }
    }

    private drawProgressBar(progress: number, radius: number, stroke: number): void {
        this.context.lineWidth = stroke
        this.context.strokeStyle = 'rgb(0 0 0 / 40%)'
        this.context.beginPath()
        this.context.arc(0, 0, radius, 0, 2 * Math.PI * progress, false)
        this.context.stroke()
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
