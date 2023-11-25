import login from "@xaviabot/fca-unofficial";
import fs from "fs/promises";
import color from "colors";
import cron from "node-cron";
import path from "path";
import axios from 'axios';
import cronConfig from "./handlers/cronJobs";
import { FCAEvent } from "./types";
import config from "./config";

const getAppstates = async () => {
  try {
    if (config.loginMethod.appstates) {
      let listState = [];
      const files = await fs.readdir("appstates");

      // Filter for JSON files
      const jsonFiles = files.filter(
        (file) => path.extname(file).toLowerCase() === ".json"
      );

      for (let i = 0; i < jsonFiles.length; i++) {
        let credentials = JSON.parse(
          await fs.readFile(`./appstates/${jsonFiles[i]}`, "utf8")
        );

        // Validate appstate
        if (typeof credentials !== "object" || !credentials[0]) {
          console.error("Invalid appstate: " + jsonFiles[i]);
          continue;
        }
        listState.push(credentials);
      }
      return listState;
    } else if (config.loginMethod.metrystate) {
      let m = config.loginMethod.metrystate;
      let listState = [];
      for (let i = 0;i < m.tokens.length;i++) {
        try {
        let { data } = await axios.get(`https://file-api.libyzxy0.repl.co/get/${m.tokens[i]}.json`);
        listState.push(data)
          return listState;
         } catch (err) {
           console.log(color.red(`Token ${m.tokens[i]} is invalid!`))
         }
        }
    } else {
      console.log("Login method not found!");
    }
  } catch (error) {
    console.error("Error getting appstates:", error.message);
    throw error;
  }
};

type CallbackType = (api: any, event: FCAEvent) => void;

async function Listen(cb: CallbackType) {
  let appstates = await getAppstates();
  if(!appstates || appstates.length == 0) {
    console.log(color.blue('Please check your login methods, no appstates found!'));
    return;
  }
  for (let i = 0; i < appstates.length; i++) {
    login(
      {
        appState: appstates[i],
        // proxy: proxy,
        // local: local
      },
      async (err: any, api: any) => {
        try {
          let cID = api.getCurrentUserID();
          let userInfo = await api.getUserInfo(cID);
          userInfo = userInfo[cID];
          console.log(
            `${color.blue(`Logged in as >>>`)} ${color.red(
              `${userInfo.name}`
            )}`
          );

          if (err) {
            console.error("Login error");
            return;
          }

          api.setOptions({
            logLevel: "silent",
            forceLogin: true,
            listenEvents: true,
            autoMarkDelivery: false,
          });

          function scheduleCronJobs(api: any) {
            cronConfig.forEach(({ expression, run }, _index) => {
              cron.schedule(expression, () => {
                run(api);
              });
            });
            console.log(
              color.blue("Cron >>> ") +
                color.green("Cron jobs scheduled.")
            );
          }
          scheduleCronJobs(api);
          api.listen((err: Error, event: FCAEvent) => {
            if (err) return console.error(err);
            cb(api, event);
          });
        } catch (err: any) {
          if (!!err.errorSummary) {
            console.log(err.errorSummary);
          } else {
            // console.log(err)
          }
        }
      }
    );
  }
}

export { Listen };
