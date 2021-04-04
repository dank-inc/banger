type Params = {
  name: string
}

export class Soundbank {
  name: string
  sounds: AudioBuffer[]

  constructor({ name }: Params) {
    this.name = name
    this.sounds = []
  }
}
