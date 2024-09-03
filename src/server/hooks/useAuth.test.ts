import { act, renderHook } from "@testing-library/react";
import { onAuthStateChanged } from "firebase/auth";
import { vi } from "vitest";

import { getUserByIdResponse } from "../../utils/mockedData";
import { AuthProvider } from "../context/authContext";
import { getUserById } from "../../server/services";
import { useAuth } from "./useAuth";

// const mockedMethod = vi.hoisted(() => {
//   return vi.fn();
// });

vi.mock("../../server/services", () => ({
  getUserById: vi.fn(),
}));

// Mock the firebase/auth module
vi.mock("firebase/auth", async () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

describe("useAuth hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  //   beforeEach(() => {
  //     (getUserById as jest.Mock).mockResolvedValue(getUserByIdResponse);
  //   });

  test("does it return anything?", () => {
    const { result } = renderHook(useAuth);

    expect(Object.keys(result.current).length).toBeGreaterThan(0);
  });

  test("does it return currentUser, loading and userLoggedIn?", async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_, callback) => {
      callback(getUserByIdResponse);
      return () => {};
    });
    (getUserById as jest.Mock).mockResolvedValue(getUserByIdResponse);

    const { result } = renderHook(useAuth, {
      wrapper: AuthProvider,
    });

    await act(async () => {});

    expect(result.current.loading).toBe(false);
    expect(result.current.currentUser).toEqual(getUserByIdResponse);
    expect(result.current.userLoggedIn).toBe(true);
  });
});
