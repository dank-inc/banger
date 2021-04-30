import { Banger, BangerParams } from './Banger'

type LooperParams = BangerParams & {
  loop?: true
}

export class Looper extends Banger {
  constructor(params: LooperParams) {
    super(params)
    this.loop = true
  }

  get state() {
    return {
      playing: this.playing,
      length: this.source?.buffer?.duration,
      currentTime: this.ctx.currentTime,
      u: this.ctx.currentTime / (this.source?.buffer?.duration || 1),
    }
  }

  pause = () => {
    if (!this.playing) return

    this.handlePause()
  }

  stop = () => {
    if (!this.playing) return

    this.handleStop()
  }

  play = () => {
    if (!this.playing) {
      this.handlePlay()
      return
    }

    this.handleStop()
    this.loadSource()
    this.handlePlay()
  }
}
