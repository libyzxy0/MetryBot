export default async function ({ api, event }) {
  api.sendMessage(
    "This is an example!" + event.senderID,
    event.threadID,
    event.messageID,
  );
}
