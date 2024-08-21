import { act, renderHook } from "@testing-library/react";

import useScrollDirection from "./useScrollDirection";

describe("useScrollDirection Hook", () => {
  beforeEach(() => {
    window.scrollY = 0;
  });

  test("returns correct value?", () => {
    const { result } = renderHook(useScrollDirection);
    expect(result.current).toBeNull();
  });

  test("returns correct value on scroll?", () => {
    const { result } = renderHook(useScrollDirection);
    act(() => {
      window.scrollY = 100;
      dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe("down");
    
    act(() => {
      window.scrollY = 60;
      dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe("up");
  });
});
