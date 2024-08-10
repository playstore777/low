import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { test, vi, expect, describe } from "vitest";
import CommentIcon from "./commentIcon";

describe("CommentIcon Component", () => {
  test("is rendered with correct props?", () => {
    const handleClick = vi.fn();
    const { container } = render(
      <CommentIcon disabled={false} onClick={handleClick} />
    );
    const commentIcon = container.querySelector("svg");
    expect(commentIcon).toBeInTheDocument();
  });

  test("is not clickable in disabled?", async () => {
    // We are using css to disable it
    const handleClick = vi.fn();
    const { container } = render(
      <CommentIcon disabled={true} onClick={handleClick} />
    );

    const commentIcon = container.querySelector("svg") as Element;
    await userEvent.click(commentIcon);

    expect(handleClick).toHaveBeenCalledTimes(0);
  });

  test("is clickable when not disabled?", async () => {
    const handleClick = vi.fn();
    const { container } = render(
      <CommentIcon disabled={false} onClick={handleClick} />
    );

    const commentIcon = container.querySelector("svg") as Element;
    await userEvent.click(commentIcon);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
