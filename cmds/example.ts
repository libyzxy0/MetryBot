import { FCAEvent } from "../types";
export default async function ({ api, event }: { api: any; event: FCAEvent }) {
  api.sendMessage("This is an example!", event.threadID, event.messageID);
}
