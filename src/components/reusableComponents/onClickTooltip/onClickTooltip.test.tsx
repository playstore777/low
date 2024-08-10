import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { textGreaterThan200Chars } from "../../../setupTests";
import OnClickTooltip from "./onClickTooltip";

describe("onClickToolTip", () => {
  test("is visible?", () => {
    render(<OnClickTooltip text="test" visible={true} />);

    const tooltip = screen.getByText("test");
    expect(tooltip).toBeInTheDocument();
  });

  test("is hidden?", () => {
    render(<OnClickTooltip text="test" visible={false} />);

    const tooltip = screen.queryByText("test");
    expect(tooltip).not.toBeInTheDocument();
  });

  test("is lengthy text clipped/hidden?", () => {
    render(<OnClickTooltip text={textGreaterThan200Chars} visible={true} />);
    const tooltip = screen.getByText(textGreaterThan200Chars.slice(0, 10), {
      exact: false,
    });
    expect(tooltip).toHaveTextContent(
      textGreaterThan200Chars.slice(0, 200) + "..."
    );
  });
});
