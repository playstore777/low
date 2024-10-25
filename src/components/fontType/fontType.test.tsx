import { screen } from "@testing-library/react";

import { renderWithProviders } from "../../utils/utilsTest";
import FontType from "./fontType";

describe.skip("FontType Component", () => {
  test("is rendered properly", () => {
    renderWithProviders(<FontType />);

    const themeBtn = screen.getByRole("button");
    expect(themeBtn).toBeInTheDocument();
  });
});
