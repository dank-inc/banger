import { IBanger } from '..'
import { Player, PlayerParams } from './Player'

type Params = PlayerParams & {
  name: string
  arrayBuffers: ArrayBuffer[]
}

export class MultiBanger extends Player implements IBanger {
  name: string
  audioBuffers: AudioBuffer[]
  loading = true

  /**
   * Used for playing libraries of similar SHORT sounds
   * For single sounds, use Banger
   * For long sounds / music, use Looper
   * NOTE: Has no stop control1!
   *
   */
  constructor(params: Params) {
    super(params)
    this.name = params.name
    this.audioBuffers = []

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

    console.log('this.source', i, this.audioBuffers.length)

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

  handleStop = () => console.info('MultiBanger has no stop control!')

  play = () => {
    this.handlePlay()
    this.loadSource()
  }
}
