import login from "fca-unofficial";
import fs from "fs";
import color from "colors";
import cron from "node-cron";
import cronConfig from "./handlers/cronJobs";
const getAppstates = async () => {
  try {
    const files = await fs.promises.readdir("appstates");
    return files;
  } catch (error) {
    console.error("Error reading folder:", error);
    throw error;
  }
};
/*
const proxy = {
  protocol: 'https',
  host: '103.69.108.78',
  port: 8191,
  type: 'https',
  anonymityLevel: 'elite',
  country: 'PH',
  city: 'Ssantiago',
  hostname: '103.69.108.78 (CITI Cableworld Inc.)',
};
 
const local = {
  timezone: 'Asia/Manila',
  region: 'ph',
  headers: {
    'X-Facebook-Locale': 'en_US',
    'X-Facebook-Timezone': 'Asia/Manila',
    'X-Fb-Connection-Quality': 'EXCELLENT',
  },
};
*/

async function Listen(cb: any) {
  let appstates = await getAppstates();
  for (let i = 0; i < appstates.length; i++) {
    let credentials = JSON.parse(
      fs.readFileSync(`./appstates/${appstates[i]}`, "utf8"),
    );
    //Validate appstate
    if (typeof credentials != "object" && !credentials[0]) {
      return console.error("Invalid appstate: " + appstates[i]);
    }
    login(
      {
        appState: credentials,
        //proxy: proxy,
        //local: local
      },
      async (err: any, api: any) => {
        try {
          let cID = api.getCurrentUserID();
          let userInfo = await api.getUserInfo(cID);
          userInfo = userInfo[cID];
          console.log(
            `${color.blue(`Logged in as >>>`)} ${color.rainbow(
              `${userInfo.name}`,
            )}`,
          );
          console.log(
            `${color.green(`Appstate OK >>>`)} ${color.rainbow(
              `${appstates[i]}`,
            )}`,
          );

          if (err) return console.error("Login error");
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
              color.blue("Cron >>> ") + color.green("Cron jobs scheduled."),
            );
          }
          scheduleCronJobs(api);
          api.listen((err: any, event: any) => {
            if (err) return console.error(err);
            cb(api, event);
          });
        } catch (err: any) {
          if (!!err.errorSummary) {
            console.log(err.errorSummary);
          } else {
            // console.log(err)
          }
          console.log(
            color.red(`Appstate Error >>>`),
            color.blue(appstates[i]),
          );
        }
      },
    );
  }
}

export { Listen };
