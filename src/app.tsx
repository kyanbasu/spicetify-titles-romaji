import * as wanakana from "wanakana";

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
      if (wanakana.isRomaji(track.metadata.title)) return;

      convertRomaji();
    }
  });
}

export default main;

function convertRomaji() {
  var timeout = 20;
  const interval = setInterval(() => {
    const titleElement = document.querySelector(".main-trackInfo-name span a");
    if (titleElement?.textContent) {
      clearInterval(interval);
      titleElement.textContent = wanakana.toRomaji(titleElement.textContent);
    }

    const nextList = document.querySelectorAll(".LineClamp");
    nextList.forEach((element) => {
      if (!element.textContent) return;
      element.textContent = wanakana.toRomaji(element.textContent);
    });
    timeout--;
    if (timeout <= 0) clearInterval(interval);
  }, 100);
}
