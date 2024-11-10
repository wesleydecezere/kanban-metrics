import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { githubRoutes } from "./routes/github/index.js";
import { webhookRoutes } from "./routes/webhook/webhook.js";
import { configRoutes } from "./routes/config/index.js";

dotenv.config();

const HOSTNAME = process.env.HOSTNAME || "http://localhost";
const PORT = process.env.PORT || 4000;

express()
  .use(cors())
  .use(express.json())
  .use("/github", githubRoutes)
  .use("/webhook", webhookRoutes)
  .use("/config", configRoutes)
  .get("/", (_, res) => {
    res.send("Bem-vindo!");
  })
  .listen(PORT, () => {
    console.log(`Servidor rodando na ${HOSTNAME}:${PORT}`);
  });
