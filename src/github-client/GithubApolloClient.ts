// error handling based on https://www.apollographql.com/docs/react/data/error-handling/#advanced-error-handling-with-apollo-link
// error handling based on https://www.marcinkwiatkowski.com/graphql/2-ways-of-handling-graphql-errors-in-apollo-client/#:~:text=You%20can%20set%20an%20error,an%20ignore%20policy%20for%20mutations.

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  from,
} from "@apollo/client/core";
import { onError } from "@apollo/client/link/error";

import fetch from "cross-fetch"; // será que elimina necessidade do cors?

export class GithubApolloClient extends ApolloClient<NormalizedCacheObject> {
  constructor() {
    if (!process.env.GITHUB_TOKEN) {
      throw new Error(
        "You need to provide a Github personal access token as `GITHUB_TOKEN` env variable. See README for more info."
      );
    }

    super({
      link: from([errorLink, httpLink]),
      defaultOptions: {
        query: {
          errorPolicy: "all",
        },
      },
      cache: new InMemoryCache(),
    });
  }
}

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message }) =>
      console.log(`[GraphQL error]: ${message}`)
    );
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const httpLink = new HttpLink({
  uri: "https://api.github.com/graphql",
  headers: {
    authorization: `token ${process.env.GITHUB_TOKEN}`,
    "X-GitHub-Api-Version": "2022-11-28",
  },
  fetch,
});
