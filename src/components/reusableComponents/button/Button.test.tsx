import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Button from "./Button";

describe("Reusable Button Component", () => {
  test("is Button rendered?", () => {
    render(<Button label="Test Button" />);

    const btn = screen.getByRole("button");
    expect(btn).toBeInTheDocument();
  });

  test("is Button rendered with correct label?", () => {
    const buttonLabel = "Submit";
    const regex = new RegExp(`^${buttonLabel}$`);
    render(<Button label={buttonLabel} />);

    const btn = screen.getByRole("button");
    expect(btn).toHaveTextContent(regex);
  });

  test("is Button onClick triggered when not disabled?", async () => {
    const btnOnClick = vi.fn();
    render(<Button label="Test" onClick={btnOnClick} />);

    const btn = screen.getByRole("button");
    await userEvent.click(btn);
    expect(btnOnClick).toBeCalledTimes(1);
  });

  test("is Button not clickable when disabled?", async () => {
    const btnOnClick = vi.fn();
    render(<Button label="Test" disabled onClick={btnOnClick} />);

    const btn = screen.getByRole("button");
    await userEvent.click(btn);
    expect(btnOnClick).toBeCalledTimes(0);
  });

  test("is tooltip visible with default message when Button disabled with tooltip and message is not provided?", async () => {
    const tooltipMessage = "";
    render(
      <Button
        label="Test"
        disabledWithMessage={true}
        tooltipType="click"
        tooltipMessage={tooltipMessage}
      />
    );

    const btn = screen.getByRole("button");
    await userEvent.click(btn);
    const tooltip = screen.getByText("No tooltip message provided!");
    expect(tooltip).toBeInTheDocument();
  });

  test("is tooltip visible when Button disabled with tooltip?", async () => {
    const tooltipMessage = "some message";
    render(
      <Button
        label="Test"
        disabledWithMessage={true}
        tooltipType="click"
        tooltipMessage={tooltipMessage}
      />
    );

    const btn = screen.getByRole("button");
    await userEvent.click(btn);
    const tooltip = screen.getByText(tooltipMessage);
    expect(tooltip).toBeInTheDocument();
  });

  test("is tooltip hidden by default when Button disabled with tooltip?", async () => {
    const tooltipMessage = "some message";
    render(
      <Button
        label="Test"
        disabledWithMessage={true}
        tooltipType="click"
        tooltipMessage={tooltipMessage}
      />
    );

    const tooltip = screen.queryByText(tooltipMessage);
    expect(tooltip).toBeNull();
  });

  // On hover and Un hover is not considered as it has CSS Style changes rather than HTML, so it is not easy or possible as this is for behavior changes.
});
