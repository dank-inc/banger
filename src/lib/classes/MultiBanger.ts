import { IBanger } from '..'
import { Player, PlayerParams } from './Player'

export type MultiBangerProps = PlayerParams & {
  name: string
  arrayBuffers: ArrayBuffer[]
  debug?: boolean
}

export class MultiBanger extends Player implements IBanger {
  name: string
  audioBuffers: AudioBuffer[]
  loading = true
  debug: boolean

  /**
   * Used for playing libraries of similar SHORT sounds
   * For single sounds, use Banger
   * For long sounds / music, use Looper
   * NOTE: Has no stop control1!
   *
   */
  constructor(params: MultiBangerProps) {
    super(params)
    this.name = params.name
    this.audioBuffers = []
    this.debug = params.debug ?? false

    this.init(params.arrayBuffers)
  }

  setVolume = (value: number) => this.handleVolume(value)
  setPan = (value: number) => this.handlePan(value)

  init = async (arrayBuffers: ArrayBuffer[]) => {
    this.audioBuffers = await Promise.all(
      arrayBuffers.map(async (buff) => await this.ctx.decodeAudioData(buff)),
    )

    this.loadSource()
    this.onLoaded?.(`Soundbank: ${this.name} loaded!`)
  }

  private loadSource = () => {
    this.source = null
    this.source = this.ctx.createBufferSource()
    // this.source.addEventListener('ended', this.loadSource)

    const i = Math.floor(Math.random() * this.audioBuffers.length)

    if (this.debug) {
      console.log('this.source', i, this.audioBuffers.length)
    }

    this.source.buffer = this.audioBuffers[i]
    this.source.addEventListener('ended', () => {
      // console.log('multibanger> ended event fired')
      this.onEnded?.()
    })
    this.source
      .connect(this.gainNode)
      .connect(this.panNode)
      .connect(this.ctx.destination)
    this.loading = false
  }

  handleStop = () => {
    if (this.debug) {
      console.info('MultiBanger has no stop control!')
    }
  }

  play = () => {
    this.handlePlay()
    this.loadSource()
  }
}
