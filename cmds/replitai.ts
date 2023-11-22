import axios from 'axios';
async function replitAI({ api, event }) {
 let input = event.body.split(" ");
  input.shift(" ");
  const apiUrl = `https://hazeyy-api-useless.kyrinwu.repl.co/api/replit/ai?input=${input.join(" ")}`;
  try {
    const response = await axios.get(apiUrl);
    if(response.data && response.data.bot_response && response.data.bot_response.trim() !== "") {
      api.sendMessage(response.data.bot_response, event.threadID, event.messageID);
    } else {
      api.sendMessage("Replit AI did not provide a valid response.", event.threadID, event.messageID);
    }
  } catch (error) {
    api.sendMessage(`${error}`, event.threadID, event.messageID);
    console.error(error);
  }
}
export default replitAI