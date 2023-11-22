import axios from "axios";
async function buddy({ api, event }) {
  try {
    let prompt = event.body.split(" ");
    prompt.shift();
    const userName = await getUserName(api, event.senderID);
    const apiUrl = "https://ai-buddy.august-quinn-api.repl.co/prompt";
    const response = await axios.post(apiUrl, {
      prompt: prompt.join(" "),
      userName,
    });
    if (
      response.data &&
      response.data.openai &&
      response.data.openai.generated_text
    ) {
      const generatedText = response.data.openai.generated_text;
      api.sendMessage(generatedText, event.threadID, event.messageID);
    } else {
      api.sendMessage(
        "Error processing the prompt. Please try again later.",
        event.threadID,
        event.messageID,
      );
    }
  } catch (err) {
    api.sendMessage(`${err}`, event.threadID, event.messageID);
  }
}
async function getUserName(api, userID) {
  try {
    const name = await api.getUserInfo(userID);
    return name[userID]?.firstName || "Friend";
  } catch (error) {
    console.error("Error getting user name:", error);
    return "Friend";
  }
}
export default buddy;
