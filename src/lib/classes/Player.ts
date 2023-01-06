export type PlayerParams = {
  volume?: number
  pan?: number
  reverse?: boolean
  loop?: boolean
  drift?: number
  playbackRate?: number
  startTime?: number
  onLoaded?: (msg?: string) => void
  onPlay?: () => void
  onEnded?: (msg?: string, manualStop?: boolean) => void
  onFail: (msg: string, shit: any) => void
}

export class Player {
  ctx: AudioContext
  source: AudioBufferSourceNode | null

  gainNode: GainNode
  panNode: StereoPannerNode
  filterNode: BiquadFilterNode

  reverse?: boolean
  loop?: boolean
  drift: number
  loading?: boolean
  playing: boolean
  playbackRate: number
  onLoaded?: (msg?: string) => void
  onEnded?: (msg?: string, manualStop?: boolean) => void
  onPlay?: () => void
  onFail: (
    msg: string,
    data?: { source?: AudioBufferSourceNode; this?: Player },
  ) => void

  /**
   * To be used as a subclasss for wrapper classes
   * the `handleX` are to be used by the parent classes as per the requirements
   */
  constructor(params: PlayerParams) {
    this.reverse = params.reverse
    this.loop = params.loop
    this.drift = params.drift || 0 // cents
    this.ctx = new window.AudioContext()
    this.source = null
    this.playing = false
    this.playbackRate = params.playbackRate || 1

    this.onLoaded = params.onLoaded
    this.onFail = params.onFail
    this.onPlay = params.onPlay
    this.onEnded = params.onEnded

    this.gainNode = this.ctx.createGain()
    this.gainNode.gain.value = params.volume || 1

    this.panNode = new StereoPannerNode(this.ctx, { pan: params.pan || 0 })
    this.filterNode = new BiquadFilterNode(this.ctx, {
      type: 'lowpass',
      frequency: 1000,
      Q: 1,
    })
  }

  handleCutoff = (hz: number, q?: number) => {
    this.filterNode.frequency.value = hz
    if (q) this.filterNode.Q.value = q
  }

  handleReverse = () => {
    if (!this.playing) return
    if (!this.source) return
  }

  handlePause = () => {
    if (!this.playing) return

    this.source?.stop()
  }

  handleVolume = (value: number) => {
    this.gainNode.gain.value = Math.max(value, 0)
  }

  handlePan = (value: number) => {
    this.panNode.pan.value = value
  }

  handleStop = () => {
    if (!this.playing) return

    this.source?.stop()
    this.playing = false
  }

  handlePlay = (at = 0) => {
    if (!this.source) {
      this.onFail('Audio not loaded', { this: this })
      // console.warn()
      return
    }

    if (this.loading) {
      this.onFail('Source is loading!', { source: this.source })
      // console.warn('Source is loading!', this.source)
      return
    }

    this.source.detune.value = 2 * (Math.random() - 0.5) * this.drift
    this.source.playbackRate.value = this.playbackRate * (this.reverse ? -1 : 1)
    this.source.start(0, at)
    this.playing = true
  }
}
