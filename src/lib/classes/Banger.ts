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
   * Used for single-shot sounds (shorter sounds)
   * For songs, recommend the 'Looper'
   */
  constructor(params: BangerParams) {
    super(params)
    this.name = params.name

    this.ctx.decodeAudioData(params.arrayBuffer).then((audioBuffer) => {
      this.audioBuffer = audioBuffer

      this.loadSource()
      params.onLoaded?.()
      console.log(params.name, 'loaded!')
    })
  }

  loadSource = () => {
    this.loading = true
    this.source = null
    this.source = this.ctx.createBufferSource()
    this.source.loop = true
    this.source.buffer = this.audioBuffer
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
    this.handlePlay()
  }
}
