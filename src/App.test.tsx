import { it, expect } from "vitest";
import { screen, render } from "@testing-library/react";
import App from "./App";

it("renders the heading with the correct class", () => {
  render(<App />);
  const headingElement = screen.getByText("Vite + React");
  expect(headingElement).toBeInTheDocument();
});
