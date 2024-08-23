import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { sprintRoutes } from "./routes/sprint.js";
import { githubRoutes } from "./routes/github/index.js";

dotenv.config();

const HOSTNAME = process.env.HOSTNAME || "http://localhost";
const PORT = process.env.PORT || 4000;

express()
  .use(cors())
  .use("/sprint", sprintRoutes)
  .use("/github", githubRoutes)
  .get("/", (req, res) => {
    res.send("Bem-vindo!");
  })
  .listen(PORT, () => {
    console.log(`Servidor rodando na ${HOSTNAME}:${PORT}`);
  });
