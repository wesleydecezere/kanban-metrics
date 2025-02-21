import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { webhookRoutes } from "./routes/webhook/webhook.js";

dotenv.config();

const HOSTNAME = process.env.HOSTNAME || "http://localhost";
const PORT = process.env.PORT || 4000;

express()
  .use(cors())
  .use(express.json())
  .use("/webhook", webhookRoutes)
  .get("/", (_, res) => {
    res.send("Bem-vindo!");
  })
  .listen(PORT, () => {
    console.log(`Servidor rodando na ${HOSTNAME}:${PORT}`);
  });
