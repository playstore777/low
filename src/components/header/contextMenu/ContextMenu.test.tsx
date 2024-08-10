import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import ContextMenu from "./ContextMenu";

// Mock functions for menu items
const mockItem1Click = vi.fn();
const mockItem2Click = vi.fn();
const onClose = vi.fn();

const menuItems = [
  { label: "Item 1", onClick: mockItem1Click },
  { label: "Item 2", onClick: mockItem2Click },
  { label: "Close", onClick: onClose },
];

describe("ContextMenu", () => {
  test("is rendered with correct props?", () => {
    const position = { x: 100, y: 50 };
    render(
      <ContextMenu
        position={position}
        menuItems={menuItems}
        onClose={() => {}}
      />
    );

    const contextMenu = screen.getByRole("list");
    expect(contextMenu).toBeInTheDocument();
    expect(contextMenu).toHaveStyle({ top: "50px", left: "100px" });

    const menuItemsList = screen.getAllByRole("listitem");
    expect(menuItemsList).toHaveLength(3);
  });

  test("is closed when clicked outside?", async () => {
    render(
      <ContextMenu
        position={{ x: 100, y: 50 }}
        menuItems={menuItems}
        onClose={() => {}}
      />
    );

    const closeOption = screen.getByText("Close");
    // Click outside the context menu
    await userEvent.click(closeOption);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("are menu items clickable?", async () => {
    render(
      <ContextMenu
        position={{ x: 100, y: 50 }}
        menuItems={menuItems}
        onClose={() => {}}
      />
    );

    const menuItem1 = screen.getByText("Item 1");
    await userEvent.click(menuItem1);

    expect(mockItem1Click).toHaveBeenCalledTimes(1);

    const menuItem2 = screen.getByText("Item 2");
    await userEvent.click(menuItem2);

    expect(mockItem2Click).toHaveBeenCalledTimes(1);
  });
});
