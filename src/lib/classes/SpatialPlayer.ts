// typescript mixin for Banger and Looper that adds spatialization

import { SpatialVec3 } from '../types/interfaces'
import { Banger, BangerParams } from './Banger'
import { LooperParams } from './Looper'

type SpatialAudioParams = (BangerParams | LooperParams) & {
  worldPosition?: SpatialVec3
  audibleDistance?: number
  orientation?: SpatialVec3
}

type Constructor<T> = new (...params: (any & SpatialAudioParams)[]) => T

export function SpatialPlayer<T extends Constructor<Banger>>(Base: T) {
  return class extends Base {
    worldPosition: SpatialVec3
    audibleDistance: number
    orientation: SpatialVec3

    constructor(...props: any[]) {
      super(...props)
      const [p] = props as [SpatialAudioParams]
      this.worldPosition = p.worldPosition || [0, 0, 0]
      this.audibleDistance = p.audibleDistance || 10
      this.orientation = p.orientation || [0, 0, 0]
    }

    setWorldPosition = ([x, y, z]: SpatialVec3) =>
      (this.worldPosition = [x, y, z])

    setOrientation = ([x, y, z]: SpatialVec3) => (this.orientation = [x, y, z])

    setSpacialSettings = (
      listenerPosition: SpatialVec3,
      // listenerOrientation: SpatialVec3,
    ) => {
      const [x, y, z] = this.worldPosition
      const [lx, ly, lz] = listenerPosition
      const pan = (x - lx) / this.audibleDistance

      this.handlePan(pan)

      const distance = Math.sqrt((x - lx) ** 2 + (z - lz) ** 2)
      const uVolume = Math.max(1 - distance / this.audibleDistance, 0)

      const volume = uVolume * 1
      this.handleVolume(volume)

      console.log('spatial> ', {
        pan,
        volume,
        //, distance, x, y, z, lx, ly, lz
      })
      // console.log('spatial> ', this.panNode.pan.value, this.gainNode.gain.value)
    }
  }
}

// export class Banger3D extends SpatialPlayer(Banger)
