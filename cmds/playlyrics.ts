import { Innertube, UniversalCache, Utils } from "youtubei.js";
import { FCAEvent } from "../types";
import axios from "axios";
import fs from "fs";
export default async function ({ api, event }: { api: any; event: FCAEvent }) {
  let input = event.body;
  let data = input.split(" ");
  if (
    !!event.body.split(" ")[1] &&
    event.body.split(" ")[1].includes("-help")
  ) {
    const usage =
      "Name: Music\n\n" +
      "Usage: ¢play [Music Title]\n\n" +
      "Description: Sends any music that you want.";
    return api.sendMessage(usage, event.threadID, event.messageID);
  }
  if (data.length < 2) {
    api.sendMessage(
      `⚠️Invalid Use Of Command!\n💡Usage: ¢play <title of music>`,
      event.threadID,
    );
  } else {
    try {
      data.shift();
      const yt = await Innertube.create({
        cache: new UniversalCache(false),
        generate_session_locally: true,
      });
      const search = await yt.music.search(data.join(" "), { type: "video" });
      if (search.results[0] === undefined) {
        api.sendMessage("Audio not found!", event.threadID, event.messageID);
      } else {
        api.sendMessage(
          `🔍 Searching for the music ${data.join(" ")}.`,
          event.threadID,
          event.messageID,
        );
      }
      const info = await yt.getBasicInfo(search.results[0].id);
      const response = await axios.get(
        `https://sampleapi-mraikero-01.vercel.app/get/lyrics?title=${info.basic_info["title"]}`,
      );
      const url = info.streaming_data?.formats[0].decipher(yt.session.player);
      const stream = await yt.download(search.results[0].id, {
        type: "audio", // audio, video or video+audio
        quality: "best", // best, bestefficiency, 144p, 240p, 480p, 720p and so on.
        format: "mp4", // media container format
      });
      const file = fs.createWriteStream("./cache/music.mp3");

      async function writeToStream(stream) {
        for await (const chunk of Utils.streamToIterable(stream)) {
          await new Promise((resolve, reject) => {
            file.write(chunk, (error) => {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            });
          });
        }

        return new Promise((resolve, reject) => {
          file.end((error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        });
      }

      async function main() {
        await writeToStream(stream);
        api.sendMessage(
          {
            body: `${info.basic_info["title"]}\n\n${response.data.result.s_lyrics}`,
            attachment: fs.createReadStream("./cache/music.mp3"),
          },
          event.threadID,
          event.messageID,
        );
      }

      main();
    } catch (err) {
      api.sendMessage(`Error ${err}`, event.threadID, event.messageID);
    }
  }
}
