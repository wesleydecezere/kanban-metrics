import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client/core";
import fetch from "cross-fetch"; // será que elimina necessidade do cors?

// TODO tratar erro, atualmente quebra app
export function apolloClient(): ApolloClient<NormalizedCacheObject> {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error(
      "You need to provide a Github personal access token as `GITHUB_TOKEN` env variable. See README for more info."
    );
  }

  console.log(`token ${process.env.GITHUB_TOKEN}`);

  return new ApolloClient({
    link: new HttpLink({
      uri: "https://api.github.com/graphql",
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      fetch,
    }),
    cache: new InMemoryCache(),
  });
}
