import { Router } from "express";
import { GithubApolloClient } from "../../github-client/GithubApolloClient";
import {
  BoardIssues,
  BoardIssuesQuery,
  BoardIssuesQueryVariables,
  LastIssues,
  LastIssuesQuery,
  LastIssuesQueryVariables,
} from "../../generated/graphql";

export const apolloRoutes = Router();

apolloRoutes.get("/issues-recent", async (req, res) => {
  const result = await new GithubApolloClient().query<
    LastIssuesQuery,
    LastIssuesQueryVariables
  >({
    query: LastIssues,
    variables: {
      repo: "pec",
      owner: "laboratoriobridge",
    },
  });

  res.send(result);
});

apolloRoutes.get("/issues-board", async (req, res) => {
  const result = await new GithubApolloClient().query<
    BoardIssuesQuery,
    BoardIssuesQueryVariables
  >({
    query: BoardIssues,
  });

  res.send(result);
});
