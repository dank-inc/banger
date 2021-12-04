import { Banger, MultiBanger, Looper, getWav, getWavs, IBanger } from './lib'

// @ts-ignore
import tezos from './audio/eli7vh-tezos-till-i-bezos-final.wav'
// @ts-ignore
import drag from './audio/drawing.wav'

const makeButton = (el: HTMLElement, player: IBanger) => {
  const playerButton = document.createElement('button')
  playerButton.addEventListener('click', (e) => {
    e.stopPropagation()
    player.play()
  })
  playerButton.innerHTML = player.name
  el.appendChild(playerButton)
}

const main = async () => {
  console.log('ADD A TRANSPOSE!')

  const drumsEl = document.getElementById('drums')
  const rootEl = document.getElementById('root')

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

  window.addEventListener('click', () => {
    console.log(draw.playing)
    if (!draw.playing) {
      console.log('draw sound start')
      draw.play()
    } else {
      console.log('draw sound stop')
      draw.stop()
    }
  })

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

  const pitchControl = document.querySelector('[data-action="pitch"]')

  pitchControl.addEventListener('input', function () {
    ttib.playbackRate = this.value
    if (!ttib.playing) return

    ttib.pause()
    ttib.play()
  })

  const volumeControl = document.querySelector('[data-action="volume"]')
  volumeControl.addEventListener('input', function () {
    ttib.setVolume(this.value)
  })

  const panControl = document.querySelector('[data-action="pan"]')
  panControl.addEventListener('input', function () {
    ttib.setPan(this.value)
  })

  // ttib.playbackRate = value
  // ttib.pause()
  // ttib.play()

  document.getElementById('pause').onclick = () => {
    console.log('pause click')
    ttib.pause()
  }

  document.getElementById('play').onclick = () => {
    console.log('play click')
    ttib.play()
  }
  document.getElementById('stop').addEventListener('click', () => {
    console.log('stop click')
    ttib.stop()
  })

  document.getElementById('state').onclick = () => {
    console.log('state click', ttib.state)
  }

  const volumeSlider = document.getElementById('volume')

  addEventListener('keydown', ({ key }) => {
    // if (key === 'e') banger.play()
    // if (key === 'q') multiBanger.play()
  })
}

main()
