import { Banger, MultiBanger, Looper, getWav, getWavs, IBanger } from './lib'

// @ts-ignore
import tezos from './audio/eli7vh-tezos-till-i-bezos-final.wav'
console.log(tezos)

const makeButton = (el: HTMLElement, player: IBanger) => {
  const playerButton = document.createElement('button')
  playerButton.addEventListener('click', player.play)
  playerButton.innerHTML = player.name
  el.appendChild(playerButton)
}

const main = async () => {
  const drumsEl = document.getElementById('drums')
  const rootEl = document.getElementById('root')

  const kick = new Looper({
    name: 'Kick',
    arrayBuffer: await getWav(
      'https://cwilso.github.io/MIDIDrums/sounds/drum-samples/CR78/kick.wav',
    ),
  })
  makeButton(drumsEl, kick)

  const ttib = new Banger({
    name: 'Tezos Till I Bezos',
    arrayBuffer: await getWav(tezos),
    drift: 0,
    loop: true,
    playbackRate: 0.75,
  })

  makeButton(rootEl, ttib)

  const files = [
    'https://cwilso.github.io/MIDIDrums/sounds/drum-samples/CR78/kick.wav',
    'https://cwilso.github.io/MIDIDrums/sounds/drum-samples/CR78/snare.wav',
    'https://cwilso.github.io/MIDIDrums/sounds/drum-samples/CR78/hihat.wav',
    'https://cwilso.github.io/MIDIDrums/sounds/drum-samples/CR78/tom1.wav',
    'https://cwilso.github.io/MIDIDrums/sounds/drum-samples/CR78/tom2.wav',
    'https://cwilso.github.io/MIDIDrums/sounds/drum-samples/CR78/tom3.wav',
  ]

  const multiBanger = new MultiBanger({
    name: 'drumz',
    arrayBuffers: await getWavs(files),
  })

  makeButton(drumsEl, multiBanger)

  document.getElementById('pitch').onchange = ({ target }) => {
    const value = parseFloat((target as HTMLInputElement).value)
    ttib.playbackRate = value
  }

  document.getElementById('pause').onclick = () => {
    ttib.pause()
  }

  document.getElementById('play').onclick = () => {
    ttib.pause()
  }
  document.getElementById('stop').onclick = () => {
    ttib.stop()
  }

  const volumeSlider = document.getElementById('volume')

  addEventListener('keydown', ({ key }) => {
    // if (key === 'e') banger.play()
    // if (key === 'q') multiBanger.play()
  })
}

main()
