import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const AUTHORIZATION = process.env.CWA_KEY;

const client = new ApolloClient({
  link: new HttpLink({
    // uri: `${process.env.NEXT_PUBLIC_API_URL}/api/graphql` || "http://localhost:3000/api/graphql",
    uri: `/api/graphql`,
    headers: {
      Authorization: AUTHORIZATION ?? "",
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  }),
  cache: new InMemoryCache(),
});

export default client;