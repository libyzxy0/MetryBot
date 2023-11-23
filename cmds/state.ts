import { FCAEvent, IState } from "../types";
import store from "../store";

export default async function ({ api, event }: { api: any; event: FCAEvent }) {
  try {
    const admins = ["100081144393297"];
    if (!admins.includes(event.senderID)) {
      api.sendMessage(
        "You don't a f*cking have permission to use this command!",
        event.threadID,
        event.messageID,
      );
      return;
    }

    const input = event.body.split(" ");
    const state: IState = store.getState();
    const targetState = input[1];
    const status = input[2];

    if (!targetState) {
      api.sendMessage(
        "Please set the target state!",
        event.threadID,
        event.messageID,
      );
      return;
    }

    const sendMessage = (message: string) =>
      api.sendMessage(message, event.threadID, event.messageID);

    switch (targetState) {
      case "bot":
        if (status === "on") store.wake_up();
        else if (status === "off") store.sleep();
        sendMessage(
          status === undefined
            ? `This config is set to state: ${state.is_awake}`
            : `Bot is now ${status === "on" ? "awake" : "sleeping"}!`,
        );
        break;

      case "shoticron":
        if (status === "on" || status === "off") {
          store.updateConfigItem("shoti_cron", status === "on");
          sendMessage(
            `Shoti Cron has been ${status === "on" ? "enabled" : "disabled"}!`,
          );
        } else {
          sendMessage(
            `This config is set to state: ${state.configs.shoti_cron}`,
          );
        }
        break;

      default:
        sendMessage("Please select the state you want to configure.");
    }
  } catch (err) {
    api.sendMessage(`Error: ${err}`, event.threadID, event.messageID);
  }
}
