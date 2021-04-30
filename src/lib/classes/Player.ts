import { Rando } from '@dank-inc/numbaz'

export type PlayerParams = {
  volume?: number
  reverse?: boolean
  loop?: boolean
  drift?: number
}

export class Player {
  ctx: AudioContext
  source: AudioBufferSourceNode | null

  gainNode: GainNode
  reverse?: boolean
  loop?: boolean
  drift: number
  loading?: boolean

  constructor(params: PlayerParams) {
    this.reverse = params.reverse
    this.loop = params.loop
    this.drift = params.drift || 0 // cents
    this.ctx = new AudioContext()
    this.source = null

    this.gainNode = this.ctx.createGain()
    this.gainNode.gain.value = params.volume || 1
  }

  handleReverse = () => {
    if (!this.source) return
  }

  handleStop = () => {
    this.source?.stop()
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
    if (this.reverse) this.source.playbackRate.value = -1
    this.source.start(0)
  }
}
