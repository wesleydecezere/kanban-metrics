import { Router } from "express";
import axios from "axios";
import { Octokit } from "octokit";

export const ghRoutes = Router();
const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
  headers: {
    "X-GitHub-Api-Version": "2022-11-28",
  },
});

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

ghRoutes.get("/issues", async (req, res) => {
  const result = await octokit
    //.request("GET /repos/{owner}/{repo}/issues", {
    .graphql(
      `
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
        `,
      {
        repo: "pec",
        owner: "laboratoriobridge",
      }
    )
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((reason) => {
      console.log(reason);
      return reason;
    });

  res.send(result);
});
