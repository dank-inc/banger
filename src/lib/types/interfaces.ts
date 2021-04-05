export interface IBanger {
  // handle monophonic shit
  //
  loading: boolean
  name: string
  onLoaded?: () => void
  play: () => void
}
