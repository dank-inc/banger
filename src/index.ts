import { Banger, getWav } from "./lib";

const main = async () => {
  const banger = new Banger({
    arrayBuffer: await getWav("/api/wavfile.wav"),
  });

  addEventListener("keydown", ({ key }) => {
    if (key === "e") banger.play();
  });
};

main();
