import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import Dropdown from "./Dropdown";

describe("Resusable Dropdown Component", () => {
  test("is it closed properly?", () => {
    render(
      <Dropdown>
        <div>trigger</div>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </Dropdown>
    );
    const trigger = screen.getByText("trigger");
    const listItems = screen.queryAllByRole("listitem");
    expect(trigger).toBeInTheDocument();
    expect(listItems.length).toBe(0);
  });

  test("is it open properly?", async () => {
    render(
      <Dropdown>
        <div>trigger</div>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </Dropdown>
    );
    const trigger = screen.getByText("trigger");
    await userEvent.click(trigger);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems.length).toBe(2);
  });

  test("is it closed on click outside?", async () => {
    render(
      <Dropdown>
        <div>trigger</div>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </Dropdown>
    );

    await userEvent.click(document.body);
    const listItems = screen.queryAllByRole("listitem");
    expect(listItems.length).toBe(0);
  });
});
