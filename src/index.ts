import { Banger, MultiBanger, getWav, getWavs, IBanger } from './lib'

// @ts-ignore
import tezos from './audio/eli7vh-tezos-till-i-bezos-final.wav'
console.log(tezos)

const rootEl = document.getElementById('root')

const makeButton = (player: IBanger) => {
  const playerButton = document.createElement('button')
  playerButton.addEventListener('click', player.play)
  playerButton.innerHTML = player.name
  rootEl.appendChild(playerButton)
}

const main = async () => {
  const banger = new Banger({
    name: 'Kick',
    arrayBuffer: await getWav(
      'https://cwilso.github.io/MIDIDrums/sounds/drum-samples/CR78/kick.wav',
    ),
  })

  const ttib = new Banger({
    name: 'Tezos Till I Bezos',
    arrayBuffer: await getWav(tezos),
    drift: 0,
    loop: true,
  })

  makeButton(banger)
  makeButton(ttib)

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

  makeButton(multiBanger)

  addEventListener('keydown', ({ key }) => {
    if (key === 'e') banger.play()
    if (key === 'q') multiBanger.play()
  })
}

main()
