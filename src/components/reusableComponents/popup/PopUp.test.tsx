import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

  test("should call handleCancel on cancel event", () => {
    // Create a mock for the onClose function
    const onCloseMock = vi.fn();

    render(
      <PopUp isOpen={false} onClose={onCloseMock}>
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
    screen.debug();

    // Select the dialog element
    const dialog = screen.getByRole("dialog", { hidden: true }); // Adjust if there's no role or use a data-testid

    // Trigger the 'cancel' event manually on the dialog element
    fireEvent(dialog, new Event("cancel"));

    // Assert that onClose was called
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
