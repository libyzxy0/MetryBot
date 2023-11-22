import { Listen } from "./login";
import message from "./handlers/onMessage";
import app from './keep_alive';
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

Listen(async (api: any, event: any) => {
  async function userInfo(id: String): Promise<any> {
    let senderInfo = await api.getUserInfo(id);
    senderInfo[`${id}`];
    return senderInfo;
  }
  switch (event.type) {
    case "message":
      if (event.body != null) {
        message({ api, event });
      }
      break;
  }
});
