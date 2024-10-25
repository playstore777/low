import { act, screen } from "@testing-library/react";
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
    // working but wanted to change the data!
    (firebaseUtils.fetchAllPosts as jest.Mock).mockResolvedValue(
      fetchAllPostsResponse
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test.skip('should render "No stories found" when no posts and no more posts', async () => {
    // Mock an empty response (no posts)
    act(() =>
      (firebaseUtils.fetchAllPosts as jest.Mock).mockResolvedValueOnce({
        articlesList: [],
        lastArticle: null,
      })
    );

    renderWithProviders(<Home />, { isAuthProvider: false, withRouter: true });

    // Assert that "No stories found" message is rendered
    expect(await screen.findByText(/No stories found/i)).toBeInTheDocument();
  });

  test.skip("should return null when no posts and hasMore is true", async () => {
    // Mock an empty response but with more posts to load
    act(() =>
      (firebaseUtils.fetchAllPosts as jest.Mock).mockResolvedValueOnce({
        articlesList: [],
        lastArticle: null,
      })
    );

    const { container } = renderWithProviders(<Home />, {
      isAuthProvider: false,
      withRouter: true,
    });

    // Assert that nothing is rendered (null)
    expect(container.firstChild).toBeNull();
  });

  test("does render with fetched stories?", async () => {
    // act(() =>
    //   (firebaseUtils.fetchAllPosts as jest.Mock).mockResolvedValue(
    //     fetchAllPostsResponse
    //   )
    // );
    renderWithProviders(<Home />, { isAuthProvider: false, withRouter: true });
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
  });
});
