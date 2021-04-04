// import { getAudioBuffers } from '../utils/api'
// import { randNormal } from '../utils/numbers'

import { getAudioBuffers } from "../utils";

// PLAYS A SINGLE SFX with varied pitch!

type Params = {
  url: string;
  volume?: number; // 0..1
  reverse?: boolean;
  loop?: boolean;
  arrayBuffer?: ArrayBuffer;
};

export interface Banger {
  ctx: AudioContext;
  url: string;
  reverse?: boolean;
  loop?: boolean;
  arrayBuffer?: ArrayBuffer;
  audioBuffer: AudioBuffer;
  gainNode: GainNode;
  source: AudioBufferSourceNode | null;
}

export class Banger {
  constructor({ url, reverse, loop, arrayBuffer }: Params) {
    // TODO: takes arrayBuffer
    this.arrayBuffer = arrayBuffer;

    this.ctx = new AudioContext();
    this.url = url;
    this.reverse = reverse;
    this.loop = loop;

    // TODO: Volume & Control
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = 0.5;

    // TODO: Reverse & Control
    this.init();
  }

  async init() {
    const arrayBuffer = await getAudioBuffers(this.url);
    if (!arrayBuffer) {
      console.log("can't init sfx player", this.url);
      return;
    }
    this.arrayBuffer = arrayBuffer;
    this.audioBuffer = await this.ctx.decodeAudioData(this.arrayBuffer);

    this.loadSource();
    this.source?.addEventListener("ended", this.loadSource);
  }

  loadSource = () => {
    this.source = null;
    this.source = this.ctx.createBufferSource();
    this.source.addEventListener("ended", this.loadSource);
    this.source.loop = true;
    this.source.buffer = this.audioBuffer;
    this.source.connect(this.ctx.destination);
  };

  play = () => {
    if (!this.source) {
      console.log("Audio not loaded");
      return;
    }
    // TODO: volume

    // this.source.connect(gainNode)
    // gainNode.connect(this.ctx.destination)

    this.source.detune.value = randNormal(100);
    if (this.reverse) this.source.playbackRate.value = -1;
    this.source.start(0);
  };
}

export const sfxLoader = (id: string) => {
  //
};
