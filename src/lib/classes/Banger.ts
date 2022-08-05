import { IBanger } from '..'
import { Player, PlayerParams } from './Player'

export type BangerParams = PlayerParams & {
  arrayBuffer: ArrayBuffer | null
  name: string
  single?: boolean
}

export class Banger extends Player implements IBanger {
  audioBuffer?: AudioBuffer | null
  name: string
  single?: boolean
  loading = true
  manualStop?: boolean

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
    this.single = params.single

    if (!params.arrayBuffer) {
      console.error('Banger', this.name, 'no array buffer found!')
      return
    }

    this.ctx.decodeAudioData(params.arrayBuffer).then((audioBuffer) => {
      this.audioBuffer = audioBuffer
      this.loadSource()
      this.onLoaded?.()
    })
  }

  loadSource = () => {
    this.loading = true
    this.source = null
    this.source = this.ctx.createBufferSource()

    if (!this.audioBuffer) {
      console.error('Banger', this.name, 'no audio buffer found!')
      return
    }

    this.source.buffer = this.audioBuffer

    this.source.addEventListener('ended', () => {
      this.playing = false
      this.onEnded?.(`onEnded -> ${this.name}`, this.manualStop!!)
      if (!this.single) this.loadSource()
    })

    this.source
      .connect(this.gainNode)
      .connect(this.panNode)
      .connect(this.ctx.destination)
    this.source.loop = !!this.loop
    this.loading = false
  }

  stop = () => {
    this.manualStop = true
    this.handleStop()
    if (!this.single) this.loadSource()
  }

  play = () => {
    if (this.playing) return

    this.manualStop = undefined
    this.handlePlay()
    this.onPlay?.()
  }
}
