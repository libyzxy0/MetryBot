import { Listen } from "./libyzxy0";
import message from "./handlers/onMessage";
import app from "./keep_alive";
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//All of the function start here!
Listen(async (api, event) => {
  switch (event.type) {
    case "message":
      if (event.body != null) {
        message({ api, event });
      }
      break;
    case "message_reply":
      if (event.body != null) {
        message({ api, event });
      }
      break;
  }
});
