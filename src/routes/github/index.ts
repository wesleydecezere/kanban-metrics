import { Router } from "express"
import { apolloRoutes } from "./apollo.js"
import { octokitRoutes } from "./octokit.js"

export const githubRoutes = Router()

githubRoutes.use("/apollo", apolloRoutes)
githubRoutes.use("/octokit", octokitRoutes)
