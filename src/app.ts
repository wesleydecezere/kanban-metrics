import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { githubRoutes } from "./routes/github/index.js";

dotenv.config();

const HOSTNAME = process.env.HOSTNAME || "http://localhost";
const PORT = process.env.PORT || 4000;

express()
  .use(cors())
  .use(express.json())
  .use("/github", githubRoutes)
  .get("/", (_, res) => {
    res.send("Bem-vindo!");
  })
  .post("/webhook", (req, res) => {
    console.log('[POST] /webhook')
    console.log(req.body) // parse schema
    res.send("Wellcome, webhook!")
  })
  .get("/webhook", (req, res) => {
    console.log('[GET] /webhook')
    res.send("Wellcome, webhook!")
  })
  .listen(PORT, () => {
    console.log(`Servidor rodando na ${HOSTNAME}:${PORT}`);
  });
