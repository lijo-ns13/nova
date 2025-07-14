import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";
import ToastProvider from "./features/user/componets/ui/ToastProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastProvider>
            {" "}
            {/* ✅ Wrap here */}
            <App />
          </ToastProvider>
        </PersistGate>
      </Provider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
);
