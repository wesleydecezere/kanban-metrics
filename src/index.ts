import express from "express";
import cors from "cors";
import { sprintRoutes } from "./routes/sprintRoutes";
import { ghRoutes } from "./routes/ghRoutes";

const HOSTNAME = process.env.HOSTNAME || "http://localhost";
const PORT = process.env.PORT || 4000;
const CLIENT_BASE_URL = "http://localhost:3000";

const app = express();

app.use(cors({ origin: [CLIENT_BASE_URL] }));
app.use("/api/sprint", sprintRoutes);
app.use("/api/gh", ghRoutes);

app.get("/", (req, res) => {
  res.send("Bem-vindo!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na ${HOSTNAME}:${PORT}`);
});
