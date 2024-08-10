import { render, screen } from "@testing-library/react";
import SidePopup from "./SidePopup";

describe("SidePopup component", () => {
  test("is rendered properly?", () => {
    render(
      <SidePopup show={true}>
        <div>child 0</div>
        <div>child 1</div>
        <div>child 2</div>
      </SidePopup>
    );

    const children = screen.getAllByText("child", { exact: false });
    children.forEach((child) => {
      expect(child).toBeInTheDocument();
    });
    expect(children.length).toBe(3);
  });

  test("is hidden properly?", () => {
    render(
      <SidePopup show={false}>
        <div>child 0</div>
        <div>child 1</div>
        <div>child 2</div>
      </SidePopup>
    );

    const children = screen.queryAllByText("child");
    expect(children.length).toBe(0);
  });
});
