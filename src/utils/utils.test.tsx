import { act, screen } from "@testing-library/react";

import { RootState, setupStore } from "../store/configureStore";
import { renderWithProviders } from "./utilsTest";
import { createElementFromHTML } from "./utils";

describe("createElementFromHTML Method", () => {
  const htmlString = `<h1> For Testing Purpose only </h1>`;

  beforeEach(() => {
    document.body.appendChild(createElementFromHTML(htmlString));
  });

  test("returns a string?", () => {
    const h1 = screen.getByRole("heading");
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveTextContent("For Testing Purpose only");
  });
});

describe("renderWithProviders", () => {
  const TestComponent = () => (
    <div data-testid="test-component">Test Component</div>
  );

  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("does it render the component with default settings properly?", () => {
    renderWithProviders(<TestComponent />);

    const testComponent = screen.getByTestId("test-component");
    expect(testComponent).toBeInTheDocument();
  });

  test("does it render the component with isAuthProvider enabled?", async () => {
    await act(async () => {
      renderWithProviders(<TestComponent />, { isAuthProvider: true });
    });

    const testComponent = screen.getByTestId("test-component");
    expect(testComponent).toBeInTheDocument();
  });

  test("does it  render the component with withRouter enabled?", () => {
    renderWithProviders(<TestComponent />, { withRouter: true });

    const testComponent = screen.getByTestId("test-component");
    expect(testComponent).toBeInTheDocument();
  });

  test("does it  render the component with ?both isAuthProvider and withRouter enabled", () => {
    renderWithProviders(<TestComponent />, {
      isAuthProvider: true,
      withRouter: true,
    });

    const testComponent = screen.getByTestId("test-component");
    expect(testComponent).toBeInTheDocument();
  });

  test("does it  render the component with custom preloaded state?", () => {
    const customPreloadedState: Partial<RootState> = {
      post: {
        activePost: {
          title: "",
          content: "",
          isEditMode: false,
        },
        allPosts: [{ id: "1", title: "Custom Post", userId: "tester123" }],
      },
    };

    const { store } = renderWithProviders(<TestComponent />, {
      preloadedState: customPreloadedState,
    });

    expect(store.getState().post.allPosts).toHaveLength(1);
    expect(store.getState().post.allPosts[0].title).toBe("Custom Post");
  });

  test("does it  render the component with a custom store?", () => {
    const customStore = setupStore({
      post: {
        allPosts: [{ id: 1, title: "Custom Post" }],
      },
    });

    const { store } = renderWithProviders(<TestComponent />, {
      store: customStore,
    });

    expect(store.getState().post.allPosts).toHaveLength(1);
    expect(store.getState().post.allPosts[0].title).toBe("Custom Post");
  });

  // test("render correctly with a custom render option", () => {
  //   renderWithProviders(<TestComponent />, {
  //     container: document.body.appendChild(document.createElement("div")),
  //   });

  // const testComponent = screen.getByTestId("test-component");
  //   expect(testComponent).toBeInTheDocument();
  // });

  test("cleans up after rendering", () => {
    const { unmount } = renderWithProviders(<TestComponent />);

    const testComponent = screen.getByTestId("test-component");
    expect(testComponent).toBeInTheDocument();

    unmount();

    expect(screen.queryByTestId("test-component")).not.toBeInTheDocument();
  });
});
