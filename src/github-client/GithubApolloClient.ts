import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  from,
} from "@apollo/client/core";
import { onError } from "@apollo/client/link/error";

import fetch from "node-fetch";

export class GithubApolloClient extends ApolloClient<NormalizedCacheObject> {
  private static _instance: ApolloClient<NormalizedCacheObject>;

  static get instance(): ApolloClient<NormalizedCacheObject> {
    if (!this._instance) {
      this._instance = new this();
    }

    return this._instance;
  }

  private constructor() {
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      throw new Error(
        "You need to provide a Github personal access token as `GITHUB_TOKEN` env variable. See README for more info."
      );
    }

    super({
      link: from([errorLink, httpLink(token)]),
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

const httpLink = (token: string) =>
  new HttpLink({
    uri: "https://api.github.com/graphql",
    headers: {
      authorization: `token ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    fetch,
  });
