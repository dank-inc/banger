import { Rando } from "@dank-inc/numbaz";
import { Soundbank } from "../types";
import { getAudioBuffers } from "../utils";

type Params =
  | {
      id: string;
      name?: string;
      drift?: number;
    }
  | {
      id?: string;
      name: string;
      drift?: number;
    };

export interface MultiBanger {
  ctx: AudioContext;
  id?: string;
  name?: string;
  drift: number;
  soundbank: Soundbank;
  arrayBuffers: ArrayBuffer[];
  audioBuffers: AudioBuffer[];
  sourceQueue: AudioBufferSourceNode[];
  playingQueue: AudioBufferSourceNode[];
  source: AudioBufferSourceNode | null;
}

export class MultiBanger {
  constructor({ id, name, drift }: Params) {
    this.ctx = new AudioContext();
    this.id = id;
    this.name = name;
    this.drift = drift || 100;
    this.init();

    this.sourceQueue = []; // TODO: Preload a bunch of sounds
    this.playingQueue = []; // TODO: Preload a bunch of sounds
    // TODO: array of playing sounds
    //
  }

  init = async () => {
    if (this.id) {
      this.soundbank = await getSoundbank(this.id);
    } else if (this.name) {
      this.soundbank = await getSoundbankByName(this.name);
    }

    if (!this.soundbank)
      throw new Error(
        `Soundbank doesn't exist! => ${this.id ? this.id : this.name} `
      );

    const arrayBuffers = await Promise.all(
      this.soundbank.files.map(
        async (filename) =>
          await getAudioBuffers(
            `assets/soundbanks/${this.soundbank.name}/${filename}`
          )
      )
    );

    this.arrayBuffers = arrayBuffers.filter((b) => b !== null) as ArrayBuffer[];

    this.audioBuffers = await Promise.all(
      this.arrayBuffers.map(
        async (buff) => await this.ctx.decodeAudioData(buff)
      )
    );

    this.loadSource();

    // push 3 random buffers in the queue

    console.log(`Soundbank: ${this.soundbank.name} loaded!`);
    // @ts-ignore
    window[this.soundbank.name] = this;
  };

  loadSource = () => {
    this.source = null;
    this.source = this.ctx.createBufferSource();
    // this.source.addEventListener('ended', this.loadSource)
    this.source.buffer = Rando.item(this.audioBuffers);
    this.source.connect(this.ctx.destination);
  };

  play = () => {
    if (!this.source) {
      console.log("Audio not loaded");
      return;
    }

    this.source.detune.value = Rando.normal(this.drift);
    this.source.start(0);

    this.loadSource();
    // const source = sourcequeue.shift
    // attenuate source, push to playing queue
    // shift to playing queue, load next
  };
}

export const createSoundbankPlayers = async () => {
  const soundbanks = await getSoundbanks();

  const banks = await Promise.all(
    soundbanks.slice(0, 10).map(async (bank) => {
      return new SoundbankPlayer({
        id: bank.id,
        drift: bank.name === "hint" ? 0 : 100,
      });
    })
  );

  return banks;
};
