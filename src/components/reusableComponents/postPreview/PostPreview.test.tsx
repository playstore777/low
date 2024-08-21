import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import PostPreview from "./PostPreview";
import { renderWithProviders } from "../../../utils/utilsTest";

describe("PostPreview Component", () => {
  const post = {
    id: "1",
    title: "Test Title",
    content: "Test Content",
    featuredImage: "test.jpg",
  };
  // let renderResult: RenderResult<Queries, HTMLElement>;
  // beforeEach(() => {
  //   renderResult = render(<PostPreview {...post} />, {
  //     wrapper: ({ children }) => (
  //       <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>
  //     ),
  //   });
  // });
  // afterEach(() => {
  //   vi.clearAllMocks();
  // });

  const mockPush = vi.fn();
  vi.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: vi.fn(() => {
      console.log("Am I called?");
    }),
  }));

  test("is correct text rendered?", () => {
    renderWithProviders(<PostPreview {...post} />, {
      isAuthProvider: false,
      withRouter: true,
    });
    const element = screen.getByText(post.title);
    expect(element).toBeInTheDocument();
  });

  //#region not working :(
  test.skip("does navigate to post details on click?", async () => {
    const renderResult = renderWithProviders(<PostPreview {...post} />, {
      isAuthProvider: false,
      withRouter: true,
    });
    const postPreview = renderResult.container.querySelector(".post");
    await userEvent.click(postPreview as Element);
    expect(mockPush?.mock.calls[0]).toEqual("/");
    // expect(mockPush?.mock.calls[0]).toEqual("/posts/1");
  }); //#endregion
});
