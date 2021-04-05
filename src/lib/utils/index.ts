export const getArrayBuffer = async (res: Response): Promise<ArrayBuffer> => {
  return res.arrayBuffer()
}

export const getWav = async (url: string): Promise<ArrayBuffer | null> => {
  // expects an audio (wav) file at the location
  try {
    const res = await fetch(url)
    return res.arrayBuffer()
  } catch (err) {
    console.warn("Can't find audio buffers for =>", url)
    return null
  }
}

export const getWavs = async (urls: string[]): Promise<ArrayBuffer[]> => {
  const arrayBuffers = await Promise.all(
    urls.map(async (url) => {
      const res = await fetch(url)
      return await res.arrayBuffer()
    }),
  )

  return arrayBuffers
}

export const getFileList = async (url: string): Promise<string[]> => {
  // garbage
  try {
    const res = await fetch(url) // Expects {files: string[]}
    const data = (await res.json()) as { files?: string[] }
    if (!data.files) throw new Error('Wrong data type')
    return data.files
  } catch (err) {
    console.error(url, 'not found', err)
    throw new Error(`${url} NOT FOUND`)
  }
}

export const createBanger = async () => {
  // create a banger and allow loading in the thingy
}
