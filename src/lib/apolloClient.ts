import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const GRAPHQL_ENDPOINT = process.env.CWA_GRAPHQL_ENDPOINT;
const AUTHORIZATION = process.env.CWA_KEY;

const client = new ApolloClient({
  link: new HttpLink({
    uri:
      typeof window === "undefined"
        ? GRAPHQL_ENDPOINT // 在伺服端時，直接用完整 URL
        : "/api/graphql", // 在瀏覽器端時，使用 `/api/graphql`
    headers: {
      Authorization: AUTHORIZATION ?? "",
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  }),
  cache: new InMemoryCache(),
});

export default client;
