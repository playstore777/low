import { screen } from "@testing-library/react";
import { vi, describe, expect } from "vitest";

import { fetchAllPostsResponse } from "../../utils/mockedData";
import { renderWithProviders } from "../../utils/utilsTest";
import * as firebaseUtils from "../../server/services";
import Home from "./Home";

const { mockedMethod } = vi.hoisted(() => {
  return { mockedMethod: vi.fn() };
});

vi.mock("../../server/services", () => ({
  //   ...jest.requireActual("../../server/services"), // Necessary for other imports
  fetchAllPosts: mockedMethod,
}));

describe("Home Component", () => {
  beforeEach(() => {
    (firebaseUtils.fetchAllPosts as jest.Mock).mockResolvedValue(
      fetchAllPostsResponse
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("does render with fetched posts?", async () => {
    renderWithProviders(<Home />, { isAuthProvider: false, withRouter: true });
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
  });
});
