import axios from "axios";
import spdy from "spdy";
import fs from "fs";
import request from "request";
import { FCAEvent } from "../types";
function delay(ms: any) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const agent = spdy.createAgent({
  host: "www.tikwm.com",
  port: 443,
  rejectUnauthorized: false,
});

const instance = axios.create({
  baseURL: "https://www.tikwm.com",
  httpAgent: agent,
  headers: {
    accept: "application/json, text/javascript, */*; q=0.01",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "sec-ch-ua":
      '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
  },
  params: {
    count: 12,
    cursor: 0,
    web: 1,
    hd: 5,
  },
});

const getVideoInfo = async (url: String) => {
  try {
    const response = await instance.post("/api/", { url });
    return response.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export default async function ({ api, event }: { api: any; event: FCAEvent }) {
  const input = event.body.split(" ");
  if (input.length < 2) {
    api.sendMessage(
      "Please enter an valid tiktok url!",
      event.threadID,
      event.messageID,
    );
  } else {
    try {
      input.shift();
      const url = input.join(" ");
      let response = await getVideoInfo(url);
      if (!response.data) {
        api.sendMessage(
          "Theres an error, while downloading your video!",
          event.threadID,
          event.messageID,
        );
        return;
      }
      let vidurl = `https://www.tikwm.com/video/media/hdplay/${response.data.id}.mp4`;
      await new Promise((resolve, reject) => {
        request(vidurl)
          .pipe(fs.createWriteStream(`./cache/tiktokdl.mp4`))
          .on("close", resolve)
          .on("error", reject);
      });
      await delay(500);

      api.setMessageReaction("✅", event.messageID, (_err: any) => {}, true);
      api.sendMessage(
        {
          body: `${response.data.title}`,
          attachment: fs.createReadStream("./cache/tiktokdl.mp4"),
        },
        event.threadID,
        event.messageID,
      );
    } catch (err) {
      api.sendMessage(`Error: ${err}`, event.threadID, event.messageID);
    }
  }
}
