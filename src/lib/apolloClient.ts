import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/graphql",
    credentials: "same-origin",
  }),
  cache: new InMemoryCache(),
});

export default client;