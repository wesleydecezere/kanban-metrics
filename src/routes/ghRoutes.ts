import { Router } from "express";
import axios from "axios";
import { Octokit } from "octokit";
import { graphql } from "@octokit/graphql";
import { Issue, Organization } from "@octokit/graphql-schema";
import { QueryTeste, QueryTesteQuery } from "../generated/graphql";

export const ghRoutes = Router();

ghRoutes.get("/auth", async (req, res) => {
  const result = await axios
    .get("https://api.github.com/octocat", {
      headers: {
        Authorization: "Bearer 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",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })
    .then(({ data, status }) => {
      console.log(data);
      console.log("response status is: ", status);
      return data;
    })
    .catch((error) => {
      if (axios.isAxiosError(error)) {
        console.log("error message: ", error.message);
        return error.message;
      } else {
        console.log("unexpected error: ", error);
        return "An unexpected error occurred";
      }
    });

  res.send(result);
});

const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
  headers: {
    "X-GitHub-Api-Version": "2022-11-28",
  },
});

ghRoutes.get("/repo-issues", async (req, res) => {
  const issuesQuery = `
    query lastIssues($owner: String!, $repo: String!, $num: Int = 3) {
      repository(owner: $owner, name: $repo) {
        issues(last: $num) {
          edges {
            node {
              title
            }
          }
        }
      }
    }
  `;
  const result = await fetchGraphQLQuery<Issue[]>(issuesQuery);
  res.send(result);
});

// playground: https://docs.github.com/pt/graphql/overview/explorer
ghRoutes.get("/board-issues", async (req, res) => {
  //  const { repository } = await graphql<{ repository: Organization }>(``);

  console.log(QueryTeste);

  const result = await fetchGraphQLQuery<QueryTesteQuery>(
    QueryTeste?.loc?.source?.body ?? ""
  );

  // res.send(errors);

  //  const result = await fetchGraphQLQuery<{repository: Repository}>(issuesQuery);
  res.send(result);
});

const fetchGraphQLQuery = <T>(query: string) => {
  return (
    octokit
      //.request("GET /repos/{owner}/{repo}/issues", {
      .graphql<T>(query, {
        repo: "pec",
        owner: "laboratoriobridge",
      })
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((reason: string) => {
        // TODO ver o que é isso
        console.log(reason);
        return reason;
      })
  );
};
