import { FCAEvent, IState } from "../types";
import store from "../store";
export default async function ({ api, event }: { api: any; event: FCAEvent }) {
  let admins = ["100081144393297"];
  if (!admins.includes(event.senderID)) {
    api.sendMessage("You don't have a f*cking permission to use this command!", event.threadID, event.messageID);
    return;
  } 
  const input = event.body.split(" ");
  const updatedState: IState = store.getState();
  if (!input[1]) {
    api.sendMessage(
      `Bot is currently ${updatedState.is_awake ? 'Awake' : 'Sleeping' }!`,
      event.threadID,
      event.messageID,
    );
  } else {
    if (input[1] == "on") {
      if (updatedState.is_awake) {
        api.sendMessage("Bot already awake!", event.threadID, event.messageID);
        return;
      }
      store.wake_up();
      api.sendMessage("Bot is now awake", event.threadID, event.messageID);
    } else if (input[1] == "off") {
      if (!updatedState.is_awake) {
        api.sendMessage("Bot already awake!", event.threadID, event.messageID);
        return;
      }
      store.sleep();
      api.sendMessage("Bot is now sleeping", event.threadID, event.messageID);
    } else {
      api.sendMessage(
        "Please set the state, on/off",
        event.threadID,
        event.messageID,
      );
    }
  }
}
