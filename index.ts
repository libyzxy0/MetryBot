import { Listen } from "./login";
import message from "./handlers/onMessage";
Listen(async (api: any, event: any) => {
  switch(event.type) {
    case "message":
      if(event.body != null) {
        message({ api, event })
      }
      break;
  }
})