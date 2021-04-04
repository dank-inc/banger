import { Player, PlayerParams } from './Player'

type Params = PlayerParams & {
  arrayBuffer: ArrayBuffer
}

export class Banger extends Player {
  audioBuffer!: AudioBuffer

  constructor(params: Params) {
    super(params)

    this.ctx.decodeAudioData(params.arrayBuffer).then((audioBuffer) => {
      this.audioBuffer = audioBuffer
      this.loadSource()
    })
  }

  private loadSource = () => {
    this.source = null
    this.source = this.ctx.createBufferSource()
    this.source.addEventListener('ended', this.loadSource)
    this.source.loop = true
    this.source.buffer = this.audioBuffer
    this.source.connect(this.ctx.destination)
  }
}
