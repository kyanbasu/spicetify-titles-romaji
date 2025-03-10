import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

const kuroshiro = new Kuroshiro();
let initializationPromise: Promise<void> | null = null;

const initKuroshiro = () => {
  if (!initializationPromise) {
    initializationPromise = kuroshiro.init(
      new KuromojiAnalyzer({
        dictPath: "https://cdn.jsdelivr.net/npm/kuromoji/dict/",
      })
    );
  }
  return initializationPromise;
};

async function main() {
  while (!Spicetify?.showNotification) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Show message on start.
  Spicetify.showNotification("spicetify-titles-romaji extension loaded!");

  convertRomaji();

  Spicetify.Player.addEventListener("songchange", async () => {
    if (!Spicetify.Player.data) return;
    const track = Spicetify.Player.data.item;
    if (track && track.metadata) {
      convertRomaji();
    }
  });
}

export default main;

function convertRomaji() {
  try {
    var timeout = 10;
    const interval = setInterval(async () => {
      const titleElement = document.querySelector(
        ".main-trackInfo-name span a"
      );
      if (titleElement?.textContent) {
        titleElement.textContent = await convertString(
          titleElement.textContent
        );
      }

      const nextList = document.querySelectorAll(".LineClamp");
      nextList.forEach(async (element) => {
        if (!element.textContent) return;
        element.textContent = await convertString(element.textContent);
      });

      const headline = document.querySelector(".encore-text-headline-large");
      if (!headline || !headline.textContent) return;
      headline.textContent = await convertString(headline.textContent);

      const tracklist = document.querySelectorAll(".main-trackList-rowTitle");
      tracklist.forEach(async (element) => {
        if (!element.textContent) return;
        element.textContent = await convertString(element.textContent);
      });
      timeout--;
      if (timeout <= 0) clearInterval(interval);
    }, 200);
  } catch (e) {
    console.error(e);
  }
}

const convertString = async (input: string) => {
  await initKuroshiro();
  return kuroshiro.convert(input, { to: "romaji" });
};
