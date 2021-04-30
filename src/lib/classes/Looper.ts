import { Banger, BangerParams } from './Banger'

type LooperParams = BangerParams & {
  loop?: true
}

export class Looper extends Banger {
  constructor(params: LooperParams) {
    super(params)
    this.loop = true
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
