import express from "express";
import cors from "cors";
import { sprintRouters } from "./routes/sprintRoutes";

const PORT = process.env.PORT || 4000;
const HOSTNAME = process.env.HOSTNAME || "http://localhost";

// App Express
const app = express();

// Endpoint raiz
app.get("/", (req, res) => {
  res.send("Bem-vindo!");
});

// Cors
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);

app.use("/api", sprintRouters);

// Resposta padrão para quaisquer outras requisições:
app.use((req, res) => {
  res.status(404);
});

// Inicia o sevidor
app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso ${HOSTNAME}:${PORT}`);
});
