import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { vi } from "vitest";

import PopUp from "./PopUp";

HTMLDialogElement.prototype.show = vi.fn(function mock(
  this: HTMLDialogElement
) {
  this.open = true;
});

HTMLDialogElement.prototype.showModal = vi.fn(function mock(
  this: HTMLDialogElement
) {
  this.open = true;
});

HTMLDialogElement.prototype.close = vi.fn(function mock(
  this: HTMLDialogElement
) {
  this.open = false;
});

describe("<PopUp />", () => {
  test("is rendered properly?", async () => {
    const closeFn = vi.fn();
    render(
      <PopUp isOpen={false} onClose={closeFn}>
        <section>
          <h1>Testing Popup</h1>
          <h3>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta at
            enim amet iure. Non consequatur dolore voluptatem natus ut quia
            aperiam. Eaque veritatis distinctio tempora dolorum iusto! Officia,
            fuga doloribus.
          </h3>
        </section>
      </PopUp>
    );

    await waitFor(() => {
      const heading = screen.queryByRole("heading");
      expect(heading).toBeNull();
    });
  });

  test("is content visible when pop up?", async () => {
    const mockFn = vi.fn;
    render(
      <PopUp isOpen={true} onClose={mockFn}>
        <section>
          <h1>Testing Popup</h1>
          <h3>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta at
            enim amet iure. Non consequatur dolore voluptatem natus ut quia
            aperiam. Eaque veritatis distinctio tempora dolorum iusto! Officia,
            fuga doloribus.
          </h3>
        </section>
      </PopUp>
    );

    await waitFor(() => {
      const heading = screen.getByText("Testing Popup");
      expect(heading).toBeInTheDocument();
    });
  });

  test("is content invisible when pop up is closed?", async () => {
    const mockFn = vi.fn();
    render(
      <PopUp isOpen={true} onClose={mockFn}>
        <section>
          <h1>Testing Popup</h1>
          <h3>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta at
            enim amet iure. Non consequatur dolore voluptatem natus ut quia
            aperiam. Eaque veritatis distinctio tempora dolorum iusto! Officia,
            fuga doloribus.
          </h3>
        </section>
      </PopUp>
    );

    await waitFor(async () => {
      const closeBtn = screen.getByRole("button");
      await userEvent.click(closeBtn);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});
