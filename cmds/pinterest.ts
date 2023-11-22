import axios from 'axios';
import fs from 'fs';
async function pinterest({ api, event }) {
  let input = event.body.split(" ");
  if(input.length < 2) {
    api.sendMessage("Missing input!", event.threadID, event.messageID);
  } else {
    try {
    input.shift()
    let txt = input.join(" ");
    const res = await axios.get(`https://api-all-1.arjhilbard.repl.co/pinterest?search=${encodeURIComponent(txt)}`);
    const data = res.data.data;
    var num = 0;
    var imgData = [];
    for (var i = 0; i < 12; i++) {
      let getDown = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
      fs.writeFileSync(`./cache/pinterest-${num+=1}.jpg`, Buffer.from(getDown, 'utf-8'));
      imgData.push(fs.createReadStream(`./cache/pinterest-${num}.jpg`));
      }
    api.sendMessage({
        attachment: imgData,
        body: "Here's your images!"
    }, event.threadID, event.messageID)
    for (let ii = 1; ii < 12; ii++) {
        fs.unlinkSync(`./cache/pinterest-${ii}.jpg`)
    }
     } catch (err) {
      api.sendMessage(`${err}`,event.threadID, event.messageID)
     }
  }
}
export default pinterest;