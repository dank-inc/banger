# Is it a banger?

answer. yes.

This is a WebAudio API library written with Typescript

infinite polyphony!
randomized sounds!

# Usage

## Banger

- single soundfile player
- pitch variation
- polyphonic!

## Example

```ts
const banger = new Banger({
  name: 'Kick',
  arrayBuffer: await getWav(
    'https://cwilso.github.io/MIDIDrums/sounds/drum-samples/CR78/kick.wav',
  ),
})

banger.loading // state while sources is loading (can be used for ui loading screens)

banger.play() // plays the sound!
```

## MultiBanger

- takes a folder of sounds
- randomizes playing of said sounds
- does the things the Banger does
- is dank
- probably needs some kind of optimization

## Example

```ts
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

multiBanger.loading // while sources are loading.

multiBanger.play() // plays a random sound!
```

# Additional Parameters

along with the basic usage you see above, both players takes the following params in the constructor

```ts
type PlayerParams = {
  volume?: number // set the volume of the player 0..1
  reverse?: boolean // play audio in reverse
  loop?: boolean // play audio in a loop!
  drift?: number // detunes the audio this random amount each play
}
```

# Todo

- RekkidPlaya
  https://archive.org/details/78_i-get-a-kick-out-of-you_ruby-newman-and-his-orchestra-ray-morton-jerome-kern-otto-h_gbia0013907/02+-+I+Get+a+Kick+Out+of+You+-+Ruby+Newman+And+His+Orchestra-restored.flac
