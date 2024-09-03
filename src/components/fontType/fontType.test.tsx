import { userEvent } from "@testing-library/user-event";
import { screen } from "@testing-library/react";

import { renderWithProviders } from "../../utils/utilsTest";
import ThemeToggle from "./fontType";

describe("ThemeToggle Component", () => {
  test("is rendered properly", () => {
    renderWithProviders(<ThemeToggle />);

    const themeBtn = screen.getByRole("button");
    expect(themeBtn).toBeInTheDocument();
  });

  test("can toggle theme?", async () => {
    renderWithProviders(<ThemeToggle />);

    const themeBtn = screen.getByRole("button");
    expect(themeBtn).toBeInTheDocument();

    expect(themeBtn).toHaveTextContent("light");

    await userEvent.click(themeBtn);
    expect(themeBtn).toHaveTextContent("dark");

    await userEvent.click(themeBtn);
    expect(themeBtn).toHaveTextContent("light");
  });
});
