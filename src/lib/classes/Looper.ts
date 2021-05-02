import { Banger, BangerParams } from './Banger'

type LooperParams = BangerParams & {
  loop?: true
}

export class Looper extends Banger {
  paused: boolean
  startedAt: number
  pausedAt: number

  constructor(params: LooperParams) {
    super(params)
    this.loop = true
    this.paused = false
    this.pausedAt = 0
    this.startedAt = 0
  }

  get state() {
    return {
      playing: this.playing,
      startedAt: this.startedAt,
      gain: this.gainNode,
      pan: this.panNode,
      pausedAt: this.pausedAt,
      length: this.source?.buffer?.duration,
      state: this.ctx.state,
      bufferLength: this.source?.buffer?.length,
      timeLength: this.source?.loopEnd,
      currentTime: this.ctx.currentTime,
      u: this.ctx.currentTime / (this.source?.buffer?.duration || 1),
    }
  }

  setPan = (value: number) => {
    console.log('pan', value)
    this.handlePan(value)
  }
  setVolume = (value: number) => this.handleVolume(value)

  pause = () => {
    if (!this.playing) return

    this.handlePause()
    this.paused = true
    this.pausedAt += this.ctx.currentTime - this.startedAt
    this.loadSource()
  }

  stop = () => {
    if (!this.playing) return

    this.handleStop()
    this.loadSource()
  }

  play = () => {
    // console.log('gonna playzos', this.pausedAt)
    if (!this.playing || this.paused) {
      this.handlePlay(this.pausedAt)
      this.paused = false
      this.startedAt = this.ctx.currentTime
      return
    }

    this.handleStop()
    this.loadSource()
    this.handlePlay()
    this.startedAt = this.ctx.currentTime
  }
}
