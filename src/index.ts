import { Banger, MultiBanger, Looper, getWav, getWavs, IBanger } from './lib'

// @ts-ignore
import tezos from './audio/eli7vh-tezos-till-i-bezos-final.wav'
// @ts-ignore
import drag from './audio/drawing.wav'

const makeButton = (
  el: HTMLElement,
  player: IBanger,
  handler?: (e: MouseEvent) => void,
) => {
  const playerButton = document.createElement('button')

  const eventHandler = (e: MouseEvent) => {
    e.stopPropagation()
    player.play()
  }

  playerButton.addEventListener('click', handler || eventHandler)
  playerButton.innerHTML = player.name
  el.appendChild(playerButton)
}

const getEl = (id: string) => document.getElementById(id) as HTMLElement
const getTarget = (e: MouseEvent) => e.target as HTMLElement
const qsi = (selector: string) =>
  document.querySelector(selector) as HTMLInputElement

const main = async () => {
  console.log('ADD A TRANSPOSE!')

  const drumsEl = getEl('drums')!
  const rootEl = getEl('root')!

  const ttib = new Looper({
    name: 'Looper: Tezos Till I Bezos',
    loop: true,
    arrayBuffer: await getWav(tezos),
    onLoaded: () => console.log('>> ttib loaded'),
    onEnded: () => console.log('>> ttib sound ended'),
    onFail: console.error,
  })
  makeButton(rootEl, ttib)

  const draw = new Looper({
    name: 'Drawing Sound',
    arrayBuffer: await getWav(drag),
    onLoaded: () => console.log('>> drwa loaded'),
    onEnded: () => console.log('>> drwa sound ended'),
    onFail: console.error,
    loop: true,
  })

  makeButton(drumsEl, draw, () => {
    if (!draw.playing) draw.play()
    else draw.stop()
  })

  const kick = new Banger({
    name: 'Banger: Kick',
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
    name: 'MultiBanger: drumz',
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
    ttib[id]?.()
  }

  Array.from(getEl('buttons').children).forEach((action) => {
    getEl(action.id).addEventListener('click', clickHander)
  })

  // getEl('volume').addEventListener('keydown', ({ key }) => {
  // if (key === 'e') banger.play()
  // if (key === 'q') multiBanger.play()
  // })
}

main()
