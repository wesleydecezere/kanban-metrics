import { Router } from "express";
import { boardFieldRoutes } from "./boardFields.js";

export const configRoutes = Router();

configRoutes.use("/boardFields", boardFieldRoutes);

configRoutes.get("/", (_, res) => {
  res.send("[GET] /config");
});
