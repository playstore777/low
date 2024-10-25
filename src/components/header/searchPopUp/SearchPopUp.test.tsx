import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import SearchPopUp from "./SearchPopUp";

describe("SearchPopUp Component", () => {
  test("is children rendered properly?", async () => {
    render(
      <SearchPopUp searchWidth="200px">
        <div>child 0</div>
        <div>child 1</div>
      </SearchPopUp>
    );

    const child0 = screen.getByText("child 0");
    expect(child0).toBeInTheDocument();

    // Once first element(search Input) is focused/clicked, the other child is shown
    await userEvent.click(child0);

    let child1 = screen.getByText("child 1");
    expect(child1).toBeInTheDocument();

    // Close the portal by clicking on the backdrop
    const backdrop = screen.getByTestId("backdrop");
    await userEvent.click(backdrop);

    child1 = screen.queryByText("child 1") as HTMLElement;
    expect(child1).toBeNull();
  });
});
