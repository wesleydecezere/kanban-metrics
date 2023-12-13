import { Octokit } from "octokit";

const octokitClient = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  headers: {
    "X-GitHub-Api-Version": "2022-11-28",
  },
});

export const octokitFetchGraphQLQuery = <T>(query: string) => {
  return (
    octokitClient
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
