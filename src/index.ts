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

  const kick = new Banger({
    name: 'Kick',
    arrayBuffer: await getWav(
      'https://cwilso.github.io/MIDIDrums/sounds/drum-samples/CR78/kick.wav',
    ),
  })

  makeButton(drumsEl, kick)

  const ttib = new Looper({
    name: 'Tezos Till I Bezos',
    arrayBuffer: await getWav(tezos),
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
    ttib.pause()
    ttib.play()
  }

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
