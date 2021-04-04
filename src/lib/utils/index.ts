export const getAudioBuffers = async (
  url: string
): Promise<ArrayBuffer | null> => {
  try {
    const res = await fetch(url);
    return res.arrayBuffer();
  } catch (err) {
    console.warn("Can't find audio buffers for =>", url);
    return null;
  }
};
