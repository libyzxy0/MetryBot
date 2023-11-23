import { IState } from "../types";
import store from "../store";
const state: IState = store.getState();
const config = [
  {
    expression: "0 7 * * *",
    run: function (api: any) {
      api.getThreadList(100, null, ["INBOX"], (_err: Error, data: any) => {
        data.forEach((info: any) => {
          if (info.isGroup && info.isSubscribed) {
            api.sendMessage(
              "Good Morning Everyone! May this day be filled with sunshine, happiness, and lots of love. Have a wonderful day ahead!\n\n~Auto Greet~",
              info.threadID,
            );
          }
        });
      });
    },
  },
  {
    expression: "0 12 * * *",
    run: function (api: any) {
      api.getThreadList(100, null, ["INBOX"], (_err: Error, data: any) => {
        data.forEach((info: any) => {
          if (info.isGroup && info.isSubscribed) {
            api.sendMessage(
              "Good Morning Everyone! May this day be filled with sunshine, happiness, and lots of love. Have a wonderful day ahead!\n\n~Auto Greet~",
              info.threadID,
            );
          }
        });
      });
    },
  },
  {
    expression: "0 19 * * *",
    run: function (api: any) {
      api.getThreadList(100, null, ["INBOX"], (_err: Error, data: any) => {
        data.forEach((info: any) => {
          if (info.isGroup && info.isSubscribed) {
            api.sendMessage(
              "Good Evening Everyone! I hope you are enjoying a relaxing and peaceful end to your day. May your evening be filled with joy and happiness!\n\n~Auto Greet~",
              info.threadID,
            );
          }
        });
      });
    },
  },
  {
    expression: "0 22 * * *",
    run: function (api: any) {
      api.getThreadList(100, null, ["INBOX"], (_err: Error, data: any) => {
        data.forEach((info: any) => {
          if (info.isGroup && info.isSubscribed) {
            api.sendMessage(
              "Good Night Everyone! May your dreams be filled with peace, love, and happiness. Have a restful sleep and wake up feeling refreshed and ready for a new day.\n\n~Auto Greet~",
              info.threadID,
            );
          }
        });
      });
    },
  },
  {
    expression: "* * * * *",
    run: function (api: any) {
      if (!state.configs.shoti_cron) {
        return;
      }
      let cmdname = "shoti";
      api.getThreadList(100, null, ["INBOX"], (_err: Error, data: any) => {
        data.forEach(async (info: any) => {
          if (info.isGroup && info.isSubscribed) {
            let { default: run } = await import(`../cmds/${cmdname}`);
            run({
              api,
              event: { threadID: info.threadID },
            });
          }
        });
      });
    },
  },
];
export default config;
