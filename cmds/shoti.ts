import axios from "axios";
import fs from "fs";
import request from "request";
function delay(ms: any) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function shoti({ event, api }) {
    const input = event.body.toLowerCase().split(' ');

    if (input.length > 1 && input[1] === '-help') {
      const usage = 'Usage: shoti\n\n' +
        'Description: Generates a random video clip using the Shoti API.\n\n' +
        'Example: shoti\n\n' +
        'Note: This command fetches a random video clip from the Shoti API and sends it as a message.';
      api.sendMessage(usage, event.threadID);
      return;
    }

    const apiUrl = 'https://api--v1-shoti.vercel.app/api/v1/get';

    try {
      const response = await axios.post(apiUrl, {
        apikey: "$shoti-1hfq7q51ea5igcrf4t8",
      });
      const videoUrl = response.data.data.url;
      await new Promise((resolve, reject) => {
        request(videoUrl)
          .pipe(fs.createWriteStream(`./cache/shoti.mp4`))
          .on('close', resolve)
          .on('error', reject);
      });
      await delay(500);

      api.setMessageReaction("✅", event.messageID, (_err: any) => {}, true);
      api.sendMessage({
        body: `@${response.data.data.user.username}`,
        attachment: fs.createReadStream('./cache/shoti.mp4')
      }, event.threadID, event.messageID);
    } catch (error) {
      api.sendMessage(`An error occurred while generating the video. Error: ${error}`, event.threadID);
    }
}
export default shoti;