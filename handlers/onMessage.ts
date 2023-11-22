const message = async ({ api, event }) => {
  if(event.body.startsWith('¢')) {
    let cmd = event.body.substring(1);
    cmd = cmd.split(" ");
try {
  if (cmd[0].length == 0) {
    return api.sendMessage(
      {
        body: "Yess " + "?, that's my prefix.",
      },
      event.threadID,
      event.messageID
    );
  } else {
    let { default: run } = await import(`../cmds/${cmd[0]}`);
    run({
      api,
      event,
    });
  }
} catch (err: any) {
  //If the file not found or something error.
  console.log(err)
  if (err.code == "ERR_MODULE_NOT_FOUND") {
    api.sendMessage(
      `Command '${cmd[0]}' isn't found on command list.`,
      event.threadID,
      event.messageID
    );
  } else {
    console.log(err);
    api.sendMessage(`Error: ${err}`, event.threadID, event.messageID);
  }
}
  }
}

export default message;