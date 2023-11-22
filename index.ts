import { Listen } from "./login";
import message from "./handlers/onMessage";
Listen(async (api: any, event: any) => {
  async function userInfo(id: String): Promise<any> {
    let senderInfo = await api.getUserInfo(id);
    senderInfo[`${id}`];
    return senderInfo;
  }
  switch (event.type) {
    case "message":
      if (event.body != null) {
        message({ api, event, userInfo });
      }
      break;
  }
});
