import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";
import ToastProvider from "./features/user/componets/ui/ToastProvider";
import { HelmetProvider } from "react-helmet-async"; // ✅ Import HelmetProvider

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HelmetProvider>
          <ToastProvider>
            {" "}
            {/* ✅ Wrap here */}
            <App />
          </ToastProvider>
        </HelmetProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
