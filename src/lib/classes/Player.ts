import { Rando } from '@dank-inc/numbaz'

export type PlayerParams = {
  volume?: number
  reverse?: boolean
  loop?: boolean
  drift?: number
  playbackRate?: number
  startTime?: number
}

export class Player {
  ctx: AudioContext
  source: AudioBufferSourceNode | null

  gainNode: GainNode
  reverse?: boolean
  loop?: boolean
  drift: number
  loading?: boolean
  playing: boolean
  playbackRate: number
  startTime: number

  constructor(params: PlayerParams) {
    this.reverse = params.reverse
    this.loop = params.loop
    this.drift = params.drift || 0 // cents
    this.ctx = new AudioContext()
    this.source = null
    this.playing = false
    this.playbackRate = params.playbackRate || 1
    this.startTime = 0

    this.gainNode = this.ctx.createGain()
    this.gainNode.gain.value = params.volume || 1
  }

  handleReverse = () => {
    if (!this.playing) return
    if (!this.source) return
  }

  handlePause = () => {
    if (!this.playing) return

    this.startTime = this.ctx.currentTime
    this.source?.stop()
  }

  handleStop = () => {
    if (!this.playing) return

    this.source?.stop()
    this.playing = false
    this.startTime = 0
  }

  handlePlay = () => {
    if (!this.source) {
      console.warn('Audio not loaded')
      return
    }

    if (this.loading) {
      console.warn('Source is loading!', this.source)
      return
    }

    // TODO: volume
    this.source.detune.value = Rando.normal(this.drift)
    this.source.playbackRate.value = this.playbackRate * (this.reverse ? -1 : 1)
    this.source.start(this.startTime)
    this.playing = true
  }
}
