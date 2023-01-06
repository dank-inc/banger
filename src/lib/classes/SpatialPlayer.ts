// typescript mixin for Banger and Looper that adds spatialization

import { SpatialVec3 } from '../types/interfaces'
import { Banger, BangerParams } from './Banger'
import { Looper, LooperParams } from './Looper'

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
    orientation?: SpatialVec3

    constructor(...props: any[]) {
      super(...props)
      const [p] = props as [SpatialAudioParams]
      this.worldPosition = p.worldPosition || [0, 0, 0]
      this.audibleDistance = p.audibleDistance || 10
      this.orientation = p.orientation
    }

    setWorldPosition = ([x, y, z]: SpatialVec3) =>
      (this.worldPosition = [x, y, z])

    setOrientation = ([x, y, z]: SpatialVec3) => (this.orientation = [x, y, z])

    setSpacialSettings = (
      listenerPosition: SpatialVec3,
      listenerOrientation: SpatialVec3,
    ) => {
      // X = right
      // Y = up
      // Z = forward
      const [x, _y, z] = this.worldPosition // B
      const [lx, _ly, lz] = listenerPosition // A
      const [ox, _oy, oz] = listenerOrientation // Ray direction

      const angle = Math.atan2(oz, ox) - Math.atan2(z - lz, x - lx) + Math.PI
      const pan = Math.sin(angle)

      this.handlePan(pan)

      const distance = Math.sqrt((x - lx) ** 2 + (z - lz) ** 2)
      const uVolume = Math.max(1 - distance / this.audibleDistance, 0)

      // use angle to determine cutoff
      // if angle is 0, cutoff is 20000
      // if angle is 180, cutoff is 5000
      const inFront = (x - lx) * ox + (z - lz) * oz > 0

      // is source in front of listener?

      if (inFront) {
        this.handleCutoff(20000)
        this.handleVolume(uVolume)
      } else {
        this.handleCutoff(5000)
        this.handleVolume(uVolume - 0.1)
      }
    }
  }
}

export const SpatialLooper = SpatialPlayer(Looper)
export const SpatialBanger = SpatialPlayer(Banger)

// export class Banger3D extends SpatialPlayer(Banger)
