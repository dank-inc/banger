import { IBanger, SpatialPlayer } from '../lib'

export const makeButton = (
  el: HTMLElement,
  player: IBanger,
  handler?: (e: MouseEvent) => void,
  name?: string,
) => {
  const playerButton = document.createElement('button')

  const eventHandler = (e: MouseEvent) => {
    e.stopPropagation()
    player.play()
  }

  playerButton.addEventListener('click', handler || eventHandler)
  playerButton.innerHTML = name || player.name
  el.appendChild(playerButton)
}

export const getEl = (id: string) => document.getElementById(id) as HTMLElement
export const getTarget = (e: MouseEvent) => e.target as HTMLElement
export const qsi = (selector: string) =>
  document.querySelector(selector) as HTMLInputElement

export const getAudio = (id: string) => {
  const audioContainer = getEl(id)
  const audio = audioContainer.querySelectorAll('audio')
  const map: Record<string, HTMLAudioElement> = {}

  Array.from(audio).forEach((el) => {
    map[el.id] = el as HTMLAudioElement
  })
  return map
}
