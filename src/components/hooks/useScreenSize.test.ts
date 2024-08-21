import { act, renderHook } from "@testing-library/react";

import useScreenSize from "./useScreenSize";

describe("useScreenSize hook", () => {
  beforeEach(() => {
    window.innerWidth = 1024;
  });

  test("returns correct value?", () => {
    const { result } = renderHook(useScreenSize);

    expect(result.current.screenSize).toBe(1024);
    expect(result.current.isMobile).toBe(false);
  });

  test("does update on resize?", () => {
    const { result } = renderHook(useScreenSize);

    act(() => {
      window.innerWidth = 500;
      window.dispatchEvent(new Event("resize")); // just dummy trigger to update the above given width in the state of the hook.
    });

    expect(result.current.screenSize).toBe(500);
    expect(result.current.isMobile).toBe(true);

    // Resize the window to a desktop size
    act(() => {
      window.innerWidth = 1024;
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current.screenSize).toBe(1024);
    expect(result.current.isMobile).toBe(false);
  });
});
