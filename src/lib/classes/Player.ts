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

  constructor(params: PlayerParams) {
    this.reverse = params.reverse
    this.loop = params.loop
    this.drift = params.drift || 100 // cents
    this.ctx = new AudioContext()
    this.source = null

    this.gainNode = this.ctx.createGain()
    this.gainNode.gain.value = params.volume || 1
  }

  // connect nodes?

  play = () => {
    if (!this.source) {
      console.log('Audio not loaded')
      return
    }

    // TODO: volume
    this.source.detune.value = Rando.normal(this.drift)
    if (this.reverse) this.source.playbackRate.value = -1
    this.source.start(0)
  }
}
