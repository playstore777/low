import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import TextButton from "./TextButton";

describe("TextButton Component", () => {
  test("is rendered with correct label?", () => {
    const handleClick = vi.fn();
    render(<TextButton label="Click me" onClick={handleClick} />);

    const buttonElement = screen.getByText("Click me");
    expect(buttonElement).toBeInTheDocument();
  });

  test("is clickable?", async () => {
    const handleClick = vi.fn();
    render(<TextButton label="Click me" onClick={handleClick} />);

    const buttonElement = screen.getByText("Click me");
    await userEvent.click(buttonElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
