import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { createWithApollo } from "./createWithApollo";
import { PaginatedPosts } from "../generated/graphql";
import { NextPageContext } from "next";
import { isServer } from "./isServer";
import { onError } from "@apollo/client/link/error";
import Router from "next/router";

const authErrorLink = onError(({ graphQLErrors }) => {
  console.log(graphQLErrors ? graphQLErrors[0] : null);
  if (graphQLErrors && graphQLErrors[0].message.includes("not authenticated")) {
    Router.replace("/login");
  }
});

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL as string,
  credentials: "include",
});

const createClient = (ctx: NextPageContext) =>
  new ApolloClient({
    headers: {
      cookie: (isServer() ? ctx.req?.headers.cookie : undefined) || "",
    },
    link: authErrorLink.concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            posts: {
              keyArgs: [],
              merge(
                existing: PaginatedPosts | undefined,
                incoming: PaginatedPosts
              ): PaginatedPosts {
                return {
                  ...incoming,
                  posts: [...(existing?.posts || []), ...incoming.posts],
                };
              },
            },
          },
        },
      },
    }),
    // credentials: "include",
  });

export const withApollo = createWithApollo(createClient);
