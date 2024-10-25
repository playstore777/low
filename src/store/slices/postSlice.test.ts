import { configureStore } from "@reduxjs/toolkit";

import PostSlice, { createPost, deletePost, uploadAllPosts } from "./postSlice";

describe("postSlice", () => {
  const store = configureStore(PostSlice);
  const initialState = store.getState();

  test("does activePost gets updated on createPost action?", () => {
    store.dispatch(createPost({ title: "Hello, World!" }));
    const finalState = store.getState();

    expect(finalState.activePost).toEqual({
      ...initialState.activePost,
      title: "Hello, World!",
    });
  });

  test("does activePost gets updated on deletePost action?", () => {
    store.dispatch(deletePost());
    const finalState = store.getState();

    expect(finalState.activePost).toEqual({
      ...initialState.activePost,
    });
  });

  test("does activePost gets updated on updatePost action?", () => {
    store.dispatch(
      uploadAllPosts([
        {
          id: "0eQUc5v1T6Pk4bPqo55h",
          description: "",
          featuredImage: "",
          content:
            '<p dir="ltr"><span style="white-space: pre-wrap;">test</span></p>',
          userId: "4s8V6d3TTPZlxVQTiuuJLpg2Dka2",
          title: "test",
          tags: [],
          createdAt: {
            seconds: 1723175473,
            nanoseconds: 543000000,
          },
        },
      ])
    );
    const finalState = store.getState();

    expect(finalState.allPosts.length).toEqual(1);
    expect(finalState.allPosts[0]).toEqual({
      id: "0eQUc5v1T6Pk4bPqo55h",
      description: "",
      featuredImage: "",
      content:
        '<p dir="ltr"><span style="white-space: pre-wrap;">test</span></p>',
      userId: "4s8V6d3TTPZlxVQTiuuJLpg2Dka2",
      title: "test",
      tags: [],
      createdAt: {
        seconds: 1723175473,
        nanoseconds: 543000000,
      },
    });
  });
});
