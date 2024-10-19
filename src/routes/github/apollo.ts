import { Router } from "express";
import { GithubApolloClient } from "../../github-gql/GithubApolloClient.js";
import {
  BoardIssuesDocument,
  BoardIssuesQuery,
  BoardIssuesQueryVariables,
  LastIssuesDocument,
  LastIssuesQuery,
  LastIssuesQueryVariables,
} from "../../graphql/generated/types.js";

export const apolloRoutes = Router();

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
  });

  res.send(result);
});

apolloRoutes.get("/issues-board", async (req, res) => {
  const result = await GithubApolloClient.instance.query<
    BoardIssuesQuery,
    BoardIssuesQueryVariables
  >({
    query: BoardIssuesDocument,
  });

  res.send(result.data.organization?.projectV2?.items.issues?.[0]?.labels);
});
