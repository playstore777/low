import { userEvent } from "@testing-library/user-event";
import { render } from "@testing-library/react";
import { test, vi, expect, describe } from "vitest";

import TestSvg from "../../../assets/images/TestSvg.svg";
import SvgWrapper from "./SvgWrapper";

describe("SvgWrapper Component", () => {
  test("is rendered with correct props?", () => {
    const handleClick = vi.fn();
    const { container } = render(
      <SvgWrapper
        SvgComponent={
          TestSvg as unknown as React.FunctionComponent<React.SVGProps<string>>
        }
        fillColor="rgb(255, 0, 0)"
        width="50px"
        height="50px"
        className="custom-class"
        onClick={handleClick}
      />
    );

    const svgElement = container.querySelector("svg");
    expect(svgElement).toHaveStyle({
      width: "50px",
      height: "50px",
      color: "rgb(255, 0, 0)",
    });
    expect(svgElement).toHaveClass("custom-class");
  });

  test("is disabled?", () => {
    const { container } = render(
      <SvgWrapper
        SvgComponent={
          TestSvg as unknown as React.FunctionComponent<React.SVGProps<string>>
        }
        disabled
      />
    );

    const svgElement = container.querySelector("svg");
    expect(svgElement).toHaveStyle({ cursor: "not-allowed" });
  });

  test("is clickable?", async () => {
    const handleClick = vi.fn();
    const { container } = render(
      <SvgWrapper
        SvgComponent={
          TestSvg as unknown as React.FunctionComponent<React.SVGProps<string>>
        }
        onClick={handleClick}
      />
    );

    const svgElement = container.querySelector("svg") as Element;
    await userEvent.click(svgElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
