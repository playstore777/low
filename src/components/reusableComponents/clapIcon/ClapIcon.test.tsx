import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { test, vi, expect, describe } from "vitest";

import ClapIcon from "./ClapIcon";
describe("ClapIcon Component", () => {
  test("is rendered with correct props?", () => {
    const handleClick = vi.fn();
    const { container } = render(
      <ClapIcon disabled={false} onClick={handleClick} label={10} />
    );
    const clapIcon = container.querySelector("svg");
    expect(clapIcon).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  test("is not clickable in disabled?", async () => {
    // We are using css to disable it
    const handleClick = vi.fn();
    const { container } = render(
      <ClapIcon disabled={true} onClick={handleClick} label={10} />
    );

    const clapIcon = container.querySelector("svg") as Element;
    await userEvent.click(clapIcon);

    expect(handleClick).toHaveBeenCalledTimes(0);
  });

  test("is clickable when not disabled?", async () => {
    const handleClick = vi.fn();
    const { container } = render(
      <ClapIcon disabled={false} onClick={handleClick} label={10} />
    );

    const clapIcon = container.querySelector("svg") as Element;
    await userEvent.click(clapIcon);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
