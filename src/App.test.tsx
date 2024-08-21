import { screen } from "@testing-library/react";
import App from "./App";
import { renderWithProviders } from "./utils/utilsTest";

describe("App Component", () => {
  test("is rendered properly?", () => {
    renderWithProviders(<App />, { withRouter: true });

    screen.debug();
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
  });
});
