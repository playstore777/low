import { ReactNode } from "react";

import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";

import { RootState, setupStore } from "../store/configureStore";
import { AuthProvider } from "../server/context/authContext";
import { fetchAllPostsResponse } from "./mockedData";
import { AllPosts } from "../store/slices/postSlice";

interface RenderWithProvidersOptions {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof setupStore>;
  isAuthProvider?: boolean;
  withRouter?: boolean;
  renderOptions?: Omit<Parameters<typeof render>[1], "wrapper">;
}

export const renderWithProviders = (
  ui: ReactNode,
  {
    preloadedState = {
      post: {
        activePost: {
          title: "",
          content: "",
          isEditMode: false,
        },
        allPosts: fetchAllPostsResponse.articlesList as AllPosts[],
      },
    },
    store = setupStore(preloadedState),
    isAuthProvider = false,
    withRouter = false,
    ...renderOptions
  }: RenderWithProvidersOptions = {}
) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      {!isAuthProvider && !withRouter && children}
      {isAuthProvider && withRouter && (
        <AuthProvider>
          <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>
        </AuthProvider>
      )}
      {isAuthProvider && <AuthProvider>{children}</AuthProvider>}
      {withRouter && (
        <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>
      )}
    </Provider>
  );

  return { store, ...render(ui, { wrapper: wrapper, ...renderOptions }) };
};
