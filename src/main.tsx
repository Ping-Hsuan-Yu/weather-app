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

const link = new HttpLink({
  uri: `/linked/graphql`,
  // uri: `https://opendata.cwa.gov.tw/linked/graphql`,
  headers: {
    Authorization: `${import.meta.env.VITE_CWA_KEY}`,
  },
  
});

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
  connectToDevTools: true,
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
