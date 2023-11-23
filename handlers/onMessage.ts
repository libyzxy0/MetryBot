import { FCAEvent, IState } from "../types";
import { ignoreCmd } from "../config";
import store from "../store";
const message = async ({ api, event }: { api: any; event: FCAEvent }) => {
  const state: IState = store.getState();
  let senderInfo = await api.getUserInfo(event.senderID);
  senderInfo = senderInfo[event.senderID];
  if (event.body.startsWith("¢")) {
    const userInput = event.body.substring(1);
    let cmd = userInput.split(" ");
    try {
      if (cmd[0].length == 0) {
        return api.sendMessage(
          {
            body: "Yess " + senderInfo.firstName + "?, that's my prefix.",
          },
          event.threadID,
          event.messageID,
        );
      } else {
        if (ignoreCmd.includes(cmd[0])) {
          if (cmd[0] == "state") {
            let { default: run } = await import(`../cmds/state`);
            run({
              api,
              event,
            });
          } else {
            console.log(cmd[0], "is ignored cmd!");
          }
          return;
        }
        //Don't accept commands if bot is sleeping.
        if (!state.is_awake) {
          api.sendMessage(
            "Bot is sleeping, don't disturb!",
            event.threadID,
            event.messageID,
          );
          return;
        }
        api.sendTypingIndicator(event.threadID);
        //Running a inputted cmd
        let { default: run } = await import(`../cmds/${cmd[0]}`);
        run({
          api,
          event,
        });
      }
    } catch (err: any) {
      //If the file not found or something error.
      if (err.code == "ERR_MODULE_NOT_FOUND") {
        api.sendMessage(
          `Command '${cmd[0]}' isn't found on command list.`,
          event.threadID,
          event.messageID,
        );
      } else {
        console.log(err);
        api.sendMessage(`Error: ${err}`, event.threadID, event.messageID);
      }
    }
  }
};

export default message;
