import { IBanger } from '..'
import { Player, PlayerParams } from './Player'

export type BangerParams = PlayerParams & {
  arrayBuffer: ArrayBuffer
  name: string
}

export class Banger extends Player implements IBanger {
  audioBuffer!: AudioBuffer
  name: string
  loading = true

  /**
   * Used for single-shot monophonic sounds (shorter sounds)
   * cannot play mmore than one sound at a time
   * For songs, recommend the 'Looper'
   *
   * Looper and MultiBanger inherit from here.
   */
  constructor(params: BangerParams) {
    super(params)
    this.name = params.name
    this.onEnded = params.onEnded

    this.ctx.decodeAudioData(params.arrayBuffer).then((audioBuffer) => {
      this.audioBuffer = audioBuffer
      params.onLoaded?.()
      this.loadSource()
    })
  }

  loadSource = () => {
    this.loading = true
    this.source = null
    this.source = this.ctx.createBufferSource()
    this.source.buffer = this.audioBuffer

    this.source.addEventListener('ended', () => {
      this.onEnded?.()
      this.playing = false
      this.loadSource()
    })

    this.source
      .connect(this.gainNode)
      .connect(this.panNode)
      .connect(this.ctx.destination)
    this.source.loop = !!this.loop
    this.loading = false
  }

  stop = () => {
    this.handleStop()
    this.loadSource()
  }

  play = () => {
    if (this.playing) return

    this.handlePlay()
  }
}
