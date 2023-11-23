const config = [
  {
    expression: "0 7 * * *",
    run: function (api) {
      api.getThreadList(100, null, ["INBOX"], (err, data) => {
        data.forEach((info) => {
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
    run: function (api) {
      api.getThreadList(100, null, ["INBOX"], (err, data) => {
        data.forEach((info) => {
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
    run: function (api) {
      api.getThreadList(100, null, ["INBOX"], (err, data) => {
        data.forEach((info) => {
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
    run: function (api) {
      api.getThreadList(100, null, ["INBOX"], (err, data) => {
        data.forEach((info) => {
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
];
export default config;
