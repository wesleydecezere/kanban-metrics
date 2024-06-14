import { Router } from "express";
import { octokitFetchGraphQLQuery } from "../../github-client/octokitClient.js";
import {
  BoardIssues,
  BoardIssuesQuery,
  LastIssues,
  LastIssuesQuery,
} from "../../graphql/generated/types.js";

export const octokitRoutes = Router();

octokitRoutes.get("/issues-recent", async (req, res) => {
  const result = await octokitFetchGraphQLQuery<LastIssuesQuery>(
    LastIssues.loc?.source?.body ?? ""
  );
  res.send(result);
});

octokitRoutes.get("/issues-board", async (req, res) => {
  const result = await octokitFetchGraphQLQuery<BoardIssuesQuery>(
    BoardIssues?.loc?.source?.body ?? ""
  );

  res.send(result);
});
