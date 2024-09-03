import { renderHook } from "@testing-library/react";
import { vi } from "vitest";

import { getUserByIdResponse } from "../../utils/mockedData";
import * as firebaseUtils from "../../server/services";
import useUser from "./useUser";
import { act } from "react";

const mockedMethod = vi.hoisted(() => {
  return vi.fn();
});

vi.mock("../../server/services", () => ({
  getUserById: mockedMethod,
}));

describe("useUser Hook", () => {
  beforeEach(() => {
    (firebaseUtils.getUserById as jest.Mock).mockResolvedValue(
      getUserByIdResponse
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test.skip("returns anything?", () => {
    act(() => {
      const { result } = renderHook(() =>
        useUser("4s8V6d3TTPZlxVQTiuuJLpg2Dka2")
      );
      console.log(result);
      const user = result.current;
      expect(user?.uid).toBe("4s8V6d3TTPZlxVQTiuuJLpg2Dka2");
    });
  });
});
