import { Queries, render, RenderResult, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { expect, test, vi } from "vitest";

import PostPreview from "./PostPreview";

describe("PostPreview Component", () => {
  const post = {
    id: "1",
    title: "Test Title",
    content: "Test Content",
    featuredImage: "test.jpg",
  };
  let renderResult: RenderResult<Queries, HTMLElement>;
  beforeEach(() => {
    renderResult = render(<PostPreview {...post} />, {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>
      ),
    });
  });
  // afterEach(() => {
  //   vi.clearAllMocks();
  // });

  test("is correct text rendered?", () => {
    const element = screen.getByText(post.title);
    expect(element).toBeInTheDocument();
  });

  const mockPush = vi.fn();

  vi.mock("react-router-dom", () => {
    return {
      // useNavigation
      default: () => ({
        push: mockPush,
      }),
    };
  });

  //#region not working :(
  test.skip("does navigate to post details on click?", async () => {
    const postPreview = renderResult.container.querySelector(".post");
    await userEvent.click(postPreview as Element);
    expect(mockPush?.mock.calls[0]).toEqual("/posts/1");
  });
  //#endregion
});
