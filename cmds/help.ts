import fs from "fs";
import path from "path";
import axios from "axios";
import { FCAEvent } from "../types";
export default async function ({ api, event }: { api: any; event: FCAEvent }) {
  let prefix = "¢";
  if (
    !!event.body.split(" ")[1] &&
    event.body.split(" ")[1].includes("-help")
  ) {
    const usage =
      "Name: Help\n\n" +
      "Usage: ¢help [int]\n\n" +
      "Description: Sends all commands that bot have!";
    return api.sendMessage(usage, event.threadID, event.messageID);
  }
  try {
    async function qt() {
      let quote = await axios
        .get("https://zenquotes.io/api/random")
        .then((response) => response.data[0].q)
        .catch((err) => "err");
      return quote;
    }

    async function readFilesInDirectory(directoryPath) {
      try {
        const files = await fs.promises.readdir(directoryPath);

        const jsFiles = files.filter((file) => {
          const filePath = path.join(directoryPath, file);
          const fileStat = fs.statSync(filePath);
          return fileStat.isFile() && path.extname(filePath) === ".ts";
        });

        const fileNames = jsFiles.map((file) => path.parse(file).name);

        return fileNames;
      } catch (error) {
        console.error("Error reading directory:", error);
        return [];
      }
    }

    let commandsArray = await readFilesInDirectory("./cmds");
    let input = event.body;
    let data = input.split(" ");
    data.shift();
    let query = data[0];

    function paginate(arr, pageLength) {
      const numOfPages = Math.ceil(arr.length / pageLength);
      const paginatedArray = [];

      for (let i = 0; i < numOfPages; i++) {
        const start = i * pageLength;
        const end = start + pageLength;
        paginatedArray.push(arr.slice(start, end));
      }
      return paginatedArray;
    }

    function show(arrList, n) {
      try {
        let r = paginate(arrList, 10);
        //r = r.join(' ')
        //r = r.split(',')
        let arr = [];
        if (!n) {
          n = 1;
          query = 1;
        }
        let list = r[n - 1];
        for (let i = 0; i < list.length; i++) {
          arr.push(`• ${prefix}${list[i]}\n\n`);
        }
        return arr;
      } catch (err) {
        //console.log(err)
        api.sendMessage(`Error: ${err}`, event.threadID, event.messageID);
      }
    }

    let qotd = await qt();
    let result = show(commandsArray, query);
    const numOfPages = paginate(commandsArray, 10).length;
    api.sendMessage(
      `｢Commands｣\n\n${result.join(
        "",
      )}\nPage » ${query}/${numOfPages}\nCommands » ${
        commandsArray.length
      } \n\n QOTD » ${qotd}`,
      event.threadID,
      event.messageID,
    );
  } catch (err) {
    api.sendMessage(err, event.messageID, event.threadID);
  }
}
