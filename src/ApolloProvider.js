import React from "react";
import App from "./App";
import {
  InMemoryCache,
  ApolloClient,
  createHttpLink,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "https://peaceful-forest-28230.herokuapp.com/",
});

const authLink = setContext(() => {
  const token = localStorage.getItem("jwtToken");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getPosts: {
            merge: false,
          },
        },
      },
      Post: {
        fields: {
          comments: {
            merge: false,
          },
        },
      },
    },
  }),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
