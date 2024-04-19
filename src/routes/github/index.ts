import { Router } from "express";
import { apolloRoutes } from "./apollo";
import { octokitRoutes } from "./octokit";

export const githubRoutes = Router();

githubRoutes.use("/apollo", apolloRoutes);
githubRoutes.use("/octokit", octokitRoutes);
