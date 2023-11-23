import axios from "axios";
import fs from "fs";
import request from "request";
import { FCAEvent } from "../types";
function delay(ms: any) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function ({ event, api }: { api: any; event: FCAEvent }) {
  const apiUrl = "https://api--v1-shoti.vercel.app/api/v1/get";

  try {
    const response = await axios.post(apiUrl, {
      apikey: "$shoti-1hfq7q51ea5igcrf4t8",
    });
    const videoUrl = response.data.data.url;
    await new Promise((resolve, reject) => {
      request(videoUrl)
        .pipe(fs.createWriteStream(`./cache/shoti.mp4`))
        .on("close", resolve)
        .on("error", reject);
    });
    await delay(500);

    api.setMessageReaction("✅", event.messageID, (_err: any) => {}, true);
    api.sendMessage(
      {
        body: `@${response.data.data.user.username}`,
        attachment: fs.createReadStream("./cache/shoti.mp4"),
      },
      event.threadID,
      event.messageID,
    );
  } catch (error) {
    api.sendMessage(
      `An error occurred while generating the video. Error: ${error}`,
      event.threadID,
    );
  }
}
