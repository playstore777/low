import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import { AuthProvider } from "./server/context/authContext/index.tsx";
import { store } from "./store/configureStore.ts";
import AppRouter from "./route/AppRouter.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </Provider>
  // </React.StrictMode>
);
