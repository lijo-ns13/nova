import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";
import ToastProvider from "./features/user/componets/ui/ToastProvider";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastProvider>
          {" "}
          {/* ✅ Wrap here */}
          <App />
        </ToastProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
// if (!socket.connected) {
//       socket.connect();
//       socket.emit("login", userId);
//     }
