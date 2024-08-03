import { Router } from "express"
import { GithubApolloClient } from "../../github-client/GithubApolloClient.js"
import {
  BoardIssuesDocument,
  type BoardIssuesQuery,
  type BoardIssuesQueryVariables,
  LastIssuesDocument,
  type LastIssuesQuery,
  type LastIssuesQueryVariables,
} from "../../graphql/generated/types.js"

export const apolloRoutes = Router()

apolloRoutes.get("/issues-recent", async (req, res) => {
  const result = await GithubApolloClient.instance.query<
    LastIssuesQuery,
    LastIssuesQueryVariables
  >({
    query: LastIssuesDocument,
    variables: {
      repo: "pec",
      owner: "laboratoriobridge",
    },
  })

  res.send(result)
})

apolloRoutes.get("/issues-board", async (req, res) => {
  const result = await GithubApolloClient.instance.query<
    BoardIssuesQuery,
    BoardIssuesQueryVariables
  >({
    query: BoardIssuesDocument,
  })

  res.send(result)
})
