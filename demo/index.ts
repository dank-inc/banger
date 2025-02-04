import {
  Banger,
  MultiBanger,
  Looper,
  getWav,
  getWavs,
  SpatialPlayer,
  SpatialVec3,
  SpatialLooper,
} from '../src/lib'
import {
  debug,
  fix,
  getAudio,
  getEl,
  getTarget,
  makeButton,
  qsi,
} from '../src/utils'

// @ts-ignore
// import tezos from './audio/eli7vh-tezos-till-i-bezos-final.wav'
// @ts-ignore
// import drag from './audio/drawing.wav'

// TODO: upload all things to static assets.

type State = {
  sourceWorldPosition: SpatialVec3
  listenerWorldPosition: SpatialVec3
  listenerOrientation: SpatialVec3
  sourceColor: string
  listenerColor: string
  moved: boolean
  canvasHeight: number
  canvasWidth: number
  dragging: boolean
  time: number
  lastTime: number
  debug: Record<string, any>
}

const main = async () => {
  console.log('ADD A TRANSPOSE!')

  const map = getAudio('audio')

  const drumsEl = getEl('drums')!
  const rootEl = getEl('root')!
  const state: State = {
    moved: false,
    sourceWorldPosition: [0, 0, 0],
    listenerWorldPosition: [0, 0, 0],
    listenerOrientation: [0, 0, -1],
    sourceColor: `rgb(100, 100, 255, 1)`,
    listenerColor: `rgb(255, 100, 100, 1)`,
    canvasHeight: 400,
    canvasWidth: 600,
    dragging: false,
    time: 0,
    lastTime: 0,
    debug: {},
  }

  const ttib = new SpatialLooper({
    name: 'Play: Tezos Till I Bezos (looper, spatial)',
    loop: true,
    arrayBuffer: await getWav(map['tezos'].src),
    onLoaded: () => console.log('>> ttib loaded'),
    onEnded: () => console.log('>> ttib sound ended'),
    onFail: console.error,
    // @ts-ignore
    worldPosition: state.sourceWorldPosition,
    // @ts-ignore
    audibleDistance: state.canvasHeight / 2,
  })

  makeButton(rootEl, ttib)

  const draw = new Looper({
    name: 'Drawing Sound',
    arrayBuffer: await getWav(map['drawing'].src),
    onLoaded: () => console.log('>> drwa loaded'),
    onEnded: () => console.log('>> drwa sound ended'),
    onFail: console.error,
    loop: true,
  })

  makeButton(getEl('loopingsfx'), draw, () => {
    if (!draw.playing) draw.play()
    else draw.stop()
  })

  const kick = new Banger({
    name: 'Play: Kick (Banger)',
    arrayBuffer: await getWav(
      'https://cwilso.github.io/MIDIDrums/sounds/drum-samples/CR78/kick.wav',
    ),
    onLoaded: () => console.log('>> kick loaded'),
    onEnded: () => console.log('>> kick sound ended'),
    onFail: (msg, player) => console.error(msg, player),
  })
  makeButton(drumsEl, kick)

  const files = [
    'https://cwilso.github.io/MIDIDrums/sounds/drum-samples/CR78/kick.wav',
    'https://cwilso.github.io/MIDIDrums/sounds/drum-samples/CR78/snare.wav',
    'https://cwilso.github.io/MIDIDrums/sounds/drum-samples/CR78/hihat.wav',
    'https://cwilso.github.io/MIDIDrums/sounds/drum-samples/CR78/tom1.wav',
    'https://cwilso.github.io/MIDIDrums/sounds/drum-samples/CR78/tom2.wav',
    'https://cwilso.github.io/MIDIDrums/sounds/drum-samples/CR78/tom3.wav',
  ]

  const multiBanger = new MultiBanger({
    name: 'Play: drumz (multi-banger)',
    arrayBuffers: await getWavs(files),
    drift: 1000,
    onLoaded: () => console.log('drum loaded'),
    onEnded: () => console.log('drum sound ended'),
    onFail: console.error,
  })

  makeButton(drumsEl, multiBanger)

  qsi('[data-action="pitch"]').addEventListener('input', function () {
    ttib.playbackRate = Number(this.value)

    if (!ttib.playing) return

    ttib.pause()
    ttib.play()
  })

  qsi('[data-action="volume"]').addEventListener('input', function () {
    ttib.setVolume(Number(this.value))
  })

  qsi('[data-action="pan"]')!.addEventListener('input', function () {
    ttib.setPan(Number(this.value))
  })

  // ttib.playbackRate = value
  // ttib.pause()
  // ttib.play()

  const clickHander = (e: MouseEvent) => {
    const id = getTarget(e).id
    console.log(id, 'click')
    // @ts-expect-error todo: fix
    ttib[id]?.()
  }

  Array.from(getEl('buttons').children).forEach((action) => {
    getEl(action.id).addEventListener('click', clickHander)
  })

  // getEl('volume').addEventListener('keydown', ({ key }) => {
  // if (key === 'e') banger.play()
  // if (key === 'q') multiBanger.play()
  // })

  const canvas = document.getElementById('viz') as HTMLCanvasElement
  const context = canvas.getContext('2d')!

  canvas.width = state.canvasWidth
  canvas.height = state.canvasHeight

  state.listenerWorldPosition = [canvas.width / 2, 0, canvas.height / 2]
  state.sourceWorldPosition = [canvas.width / 2, 0, canvas.height / 3]

  const setListenerOrientation = (x: number, z: number) => {
    const dx = x - state.listenerWorldPosition[0]
    const dz = z - state.listenerWorldPosition[2]
    const angle = Math.atan2(dz, dx)
    state.listenerOrientation = [Math.cos(angle), 0, Math.sin(angle)]
  }

  const setListenerWorldPosition = (x: number, z: number) => {
    state.listenerWorldPosition = [x, 0, z]
  }

  // add mouse click listener and set source position to mouse position
  canvas.addEventListener('click', (e) => {
    state.moved = true

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const z = e.clientY - rect.top

    // if right click, set listener orientation to look at mouse position
    if (e.shiftKey) return setListenerOrientation(x, z)
    if (e.altKey) return setListenerWorldPosition(x, z)

    state.sourceWorldPosition = [x, 0, z]
  })

  // mouse drag listener
  canvas.addEventListener('mousedown', (e) => {
    state.dragging = true
  })

  canvas.addEventListener('mouseup', (e) => {
    state.dragging = false
  })

  canvas.addEventListener('mousemove', (e) => {
    if (!state.dragging) return
    state.moved = true

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const z = e.clientY - rect.top

    if (e.shiftKey) return setListenerOrientation(x, z)
    else if (e.altKey) return setListenerWorldPosition(x, z)
    else state.sourceWorldPosition = [x, 0, z]
  })

  canvas.addEventListener('contextmenu', (event) => event.preventDefault())

  state.lastTime = Date.now()
  state.debug = getEl('debug')

  const drawVisual = () => {
    const now = Date.now()
    const dt = now - state.lastTime
    state.lastTime = now

    state.time += dt / 1000

    context.fillStyle = 'rgb(20, 20, 20, 1)'
    context.fillRect(0, 0, canvas.width, canvas.height)

    // listner angle from orientation x,z
    const listenerAngle = Math.atan2(
      state.listenerOrientation[2],
      state.listenerOrientation[0],
    )

    context.beginPath()
    // draw arrow from listener origin out 30 units in direction of listener orientation
    context.moveTo(
      state.listenerWorldPosition[0],
      state.listenerWorldPosition[2],
    )
    context.lineTo(
      state.listenerWorldPosition[0] + 30 * Math.cos(listenerAngle),
      state.listenerWorldPosition[2] + 30 * Math.sin(listenerAngle),
    )
    context.strokeStyle = 'white'
    context.lineWidth = 3
    context.stroke()

    // white circle at listener position
    context.beginPath()
    context.arc(
      state.listenerWorldPosition[0],
      state.listenerWorldPosition[2],
      5,
      0,
      2 * Math.PI,
      false,
    )
    context.fillStyle = 'white'
    context.fill()

    // draw grey line from listener to source
    context.beginPath()
    context.moveTo(
      state.listenerWorldPosition[0],
      state.listenerWorldPosition[2],
    )
    context.lineTo(state.sourceWorldPosition[0], state.sourceWorldPosition[2])
    context.strokeStyle = 'grey'
    context.lineWidth = 1
    context.stroke()

    // rotate listener
    // state.listenerOrientation = [Math.cos(state.time), 0, Math.sin(state.time)]

    // draw blue circle at source position
    context.beginPath()
    context.arc(
      state.sourceWorldPosition[0],
      state.sourceWorldPosition[2],
      10,
      0,
      2 * Math.PI,
      false,
    )
    context.fillStyle = state.sourceColor
    context.fill()

    // draw audible range circle with gradient fill to edges

    const gradient = context.createRadialGradient(
      state.listenerWorldPosition[0],
      state.listenerWorldPosition[2],
      0,
      state.listenerWorldPosition[0],
      state.listenerWorldPosition[2],
      // @ts-ignore
      ttib.audibleDistance,
    )

    gradient.addColorStop(0, 'rgba(100, 100, 100, 0.5)')
    gradient.addColorStop(1, 'rgba(100, 100, 100, 0)')
    context.beginPath()
    context.arc(
      state.listenerWorldPosition[0],
      state.listenerWorldPosition[2],
      // @ts-ignore
      ttib.audibleDistance,
      0,
      2 * Math.PI,
      false,
    )
    context.fillStyle = gradient
    context.fill()

    // draw axis lines
    context.strokeStyle = '#ddd2'
    context.lineWidth = 1

    context.beginPath()

    context.moveTo(canvas.width / 2, 0)
    context.lineTo(canvas.width / 2, canvas.height)

    context.moveTo(0, canvas.height / 2)
    context.lineTo(canvas.width, canvas.height / 2)
    context.stroke()

    if (state.moved) {
      const [sx, sy, sz] = state.sourceWorldPosition
      ttib.setWorldPosition([sx - canvas.width / 2, sy, sz - canvas.height / 2])

      const [x, y, z] = state.listenerWorldPosition
      const [angle, distance] = ttib.get3DValues(
        [x - canvas.width / 2, y, z - canvas.height / 2],
        state.listenerOrientation,
      )
      ttib.setSpatialValues(angle, distance)

      const degrees = Math.sin(angle + Math.PI / 2)

      debug('lis x,z', fix(x - canvas.width / 2), fix(z - canvas.height / 2))
      debug('lis rot', ...state.listenerOrientation.map((v) => fix(v, 2)))
      debug(
        'source x,z',
        fix(sx - canvas.width / 2),
        fix(sz - canvas.height / 2),
      )

      debug('angle', fix(angle, 2))
      debug('degrees', fix(degrees, 2))
      debug('distance', fix(distance, 1))
      debug('audible range', fix(ttib.audibleDistance))
      debug('volume scale', fix(ttib.volumeScale, 1))

      const pan = ttib.panNode.pan.value
      const cutoff = ttib.filterNode.frequency.value
      const gain = ttib.gainNode.gain.value

      debug('panning', pan > 0 ? 'R' : 'L', fix(Math.abs(pan * 100)))
      debug('cutoff', fix(cutoff), 'hz')
      debug('gain', fix(gain * 100), '%')

      state.moved = false
    }

    requestAnimationFrame(drawVisual)
  }

  drawVisual()
}

main()
