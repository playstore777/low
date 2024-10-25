import { RenderResult, screen, waitFor } from "@testing-library/react";

import Layout from "./Layout";
import { renderWithProviders } from "../utils/utilsTest";

// describe.skip will still return error if any, source: https://github.com/vitest-dev/vitest/issues/2371#issuecomment-1324747696
describe("Layout Component", () => {
  let renderResult: RenderResult;
  beforeEach(() => {
    renderResult = renderWithProviders(<Layout />, {
      isAuthProvider: false,
      withRouter: true,
    });
  });

  test("renders Header component", () => {
    const header = screen.getByRole("banner", { hidden: true });
    expect(header).toBeInTheDocument();
  });

  test("renders Outlet for nested routes", () => {
    const mainContainer =
      renderResult.container.querySelector(".main-container");
    expect(mainContainer).toBeInTheDocument();
  });

  test("renders Toast in ToastContainer", async () => {
    // Wrap in waitFor to handle any asynchronous render issues
    await waitFor(() => {
      const toastContainer = renderResult.container.querySelector(".Toastify");
      expect(toastContainer).toBeInTheDocument();
    });
  });
});
