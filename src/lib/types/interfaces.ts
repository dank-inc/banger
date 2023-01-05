export interface IBanger {
  // handle monophonic shit
  //
  loading: boolean
  name: string
  onLoaded?: () => void
  play: () => void
}

export type SpatialVec3 = [x: number, y: number, z: number]
