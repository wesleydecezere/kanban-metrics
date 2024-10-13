import { Router } from "express";
import { apolloRoutes } from "./apollo.js";

export const githubRoutes = Router();

githubRoutes.use("/apollo", apolloRoutes);
