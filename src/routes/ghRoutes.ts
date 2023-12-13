import { Router } from "express";
import { octokitFetchGraphQLQuery } from "../github-client/octokitClient";
import { apolloClient } from "../github-client/apolloClient";
import {
  BoardIssues,
  BoardIssuesQuery,
  BoardIssuesQueryVariables,
  LastIssues,
  LastIssuesQuery,
  LastIssuesQueryVariables,
} from "../generated/graphql";

export const ghRoutes = Router();

ghRoutes.get("/octokit/issues-recent", async (req, res) => {
  const result = await octokitFetchGraphQLQuery<LastIssuesQuery>(
    LastIssues.loc?.source?.body ?? ""
  );
  res.send(result);
});

// playground: https://docs.github.com/pt/graphql/overview/explorer
ghRoutes.get("/octokit/issues-board", async (req, res) => {
  const result = await octokitFetchGraphQLQuery<BoardIssuesQuery>(
    BoardIssues?.loc?.source?.body ?? ""
  );

  res.send(result);
});

ghRoutes.get("/apollo/issues-recent", async (req, res) => {
  const result = await apolloClient().query<
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

ghRoutes.get("/apollo/issues-board", async (req, res) => {
  const result = await apolloClient().query<
    BoardIssuesQuery,
    BoardIssuesQueryVariables
  >({
    query: BoardIssues,
  });

  res.send(result);
});
