import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import AppRouter from "./route/AppRouter.tsx";
import { AuthProvider } from "./server/context/authContext/index.tsx";
import { Provider } from "react-redux";
import { store } from "./store/configureStore.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </Provider>
  // </React.StrictMode>
);
