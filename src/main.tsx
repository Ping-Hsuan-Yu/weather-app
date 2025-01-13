import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { WeatherProvider } from "./contexts/WeatherContext.tsx";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "/graphql",
    headers: {
      Authorization: "CWB-31DC3369-D513-4BC6-8BF8-518F5F245D78",
    },
  }),
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
        <WeatherProvider>
          <App />
        </WeatherProvider>
    </ApolloProvider>
  </StrictMode>
);
