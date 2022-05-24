import CryptoTracker from "./CryptoTracker";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient} contextSharing={true}>
    <CryptoTracker cryptoName="bitcoin" />
  </QueryClientProvider >
);

export default App;
