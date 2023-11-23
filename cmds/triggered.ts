import ameClient from "amethyste-api";
const ameApi = new ameClient(
  "365745f69238ead2e433c23bb9ccd972293d3c9553a25fc31f647b4ae047e5b201bc5d94584dfe3afbd79d233ec8bbc85d2f1d610bf9749ddb97a0915e630040",
);
import { FCAEvent } from "../types";
import fs from "fs";
export default async function ({ api, event }: { api: any; event: FCAEvent }) {
  try {
    let data = event.body.split(" ");
    data.shift();
    let uid;
    if (Object.keys(event.mentions) == 0 && data.join(" ") != "@me") {
      api.sendMessage(
        "Error, please mention a f*cking person!",
        event.threadID,
        event.messageID,
      );
    } else if (Object.keys(event.mentions) == 0 && data.join(" ") == "@me") {
      uid = event.senderID;
    } else if (Object.keys(event.mentions) != 0) {
      uid = Object.keys(event.mentions)[0];
    }
    let url = `https://graph.facebook.com/${uid}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    ameApi
      .generate("triggered", {
        url: url,
      })
      .then((image) => {
        const filePath = "./cache/triggered.png";
        fs.writeFile(filePath, image, (err) => {
          if (err) {
            console.error("Error writing file:", err);
            return;
          }
          api.sendMessage(
            {
              attachment: fs.createReadStream("./cache/triggered.png"),
            },
            event.threadID,
            event.messageID,
          );
        });
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    api.sendMessage(`Error: ${err}`, event.threadID, event.messageID);
  }
}
