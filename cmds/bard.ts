import Bard from "bard-ai";
import { FCAEvent } from "../types";
import axios from 'axios';
import fs from 'fs';
export default async function ({ api, event }: { api: any; event: FCAEvent }) {
  try {
    let input = event.body.split(" ");
    if (input.length < 2) {
      api.sendMessage("Hellooo!", event.threadID, event.messageID);
      return;
    }

    input.shift();
    const txt = input.join(" ");
    const bard = new Bard(process.env?.BARD_COOKIE);
    let replyImg = event.type == "message_reply" ? event.messageReply?.attachments[0]?.url : null;
    if(replyImg) {
      let getDown = (
          await axios.get(`${replyImg}`, { responseType: "arraybuffer" })
        ).data;
         fs.writeFileSync(
          `./cache/bard-lens.png`,
          Buffer.from(getDown, "utf-8"),
        );
    }
    let feedImage = replyImg ? "./cache/bard-lens.png" : null;
    console.log(feedImage)
    let markdownText = await bard.ask(txt, {
      image: feedImage
    });
    if (!markdownText) {
      console.error("Error: No response from Bard API");
      api.sendMessage("Error: Unable to process the request", event.threadID, event.messageID);
      return;
    }
    const regex = /\[([^\]]*)\]\(([^)]*)\)/g;
    
    const matches = [...markdownText.matchAll(regex)];
    const urlsArray: string[] = [];

    matches.forEach(match => {
      const [fullMatch, text, url] = match;
      urlsArray.push(url);
    });
    
    const plainText = markdownText.replace(/!\[.*\]\(.*\)/g, '').trim() || "";
    console.log(urlsArray)
    var imgData = [];
    if(urlsArray.length > 0) {
      for (var i = 0; i < urlsArray.length; i++) {
        let getDown = (
          await axios.get(`${urlsArray[i]}`, { responseType: "arraybuffer" })
        ).data;
        fs.writeFileSync(
          `./cache/bard-${i}.jpg`,
          Buffer.from(getDown, "utf-8"),
        );
        imgData.push(fs.createReadStream(`./cache/bard-${i}.jpg`));
      }
      api.sendMessage(
        {
          attachment: imgData,
          body: plainText,
        },
        event.threadID,
        event.messageID,
      );
    } else {
      api.sendMessage(markdownText, event.threadID, event.messageID)
    } 
  } catch (err) {
    console.error(err);
    api.sendMessage('Hala, ewan error e.', event.threadID, event.messageID);
  }
}