import express from "express";
const app = express();

app.get("/", (_req, res) => {
  res.send("Hello, this is MetryBot");
});

export default app;
