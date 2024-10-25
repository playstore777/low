import { createSlice } from "@reduxjs/toolkit";

import { Comment, Post } from "../../types/types";

export type InitialState = {
  activePost: {
    id?: string;
    title: string;
    content: string;
    isEditMode?: boolean;
    comments?: Comment[];
    draftTimer?: NodeJS.Timeout;
  };
  allPosts: Post[];
};

const initialState: InitialState = {
  activePost: {
    id: "",
    title: "",
    content: "",
    isEditMode: false,
    comments: [],
    draftTimer: undefined,
  },
  allPosts: [],
};

const PostSlice = createSlice({
  name: "postSlice",
  initialState,
  reducers: {
    createPost: (state, action) => {
      state.activePost = { ...state.activePost, ...action.payload };
    },
    deletePost: (state) => {
      state.activePost = { ...initialState.activePost };
    },
    uploadAllPosts: (state, action) => {
      // Avoid duplication
      // const newPostsId = action.payload.map((post: Post) => post.id);
      // const filteredPrevPosts = state.allPosts.filter(
      //   (post) => !newPostsId.includes(post.id)
      // );
      // state.allPosts = [...filteredPrevPosts, ...action.payload];
      const array = [...state.allPosts, ...action.payload];

      const key = "id";

      const uniqueArrayByKey = [
        ...new Map(array.map((item) => [item[key], item])).values(),
      ];
      state.allPosts = uniqueArrayByKey;
    },
    updateComments: (state, action) => {
      // Avoid duplication
      // const newCommentsId = action.payload.map(
      //   (comment: Comment) => comment.id
      // );
      // const filteredPrevComments = state.activePost.comments?.filter(
      //   (comment) => !newCommentsId.includes(comment.id)
      // );
      // state.activePost.comments = [
      //   ...(filteredPrevComments ?? []),
      //   ...action.payload,
      // ];
      const array = [...(state.activePost.comments ?? []), ...action.payload];

      const key = "id";

      const arrayUniqueByKey = [
        ...new Map(array.map((item) => [item[key], item])).values(),
      ];
      state.activePost.comments = arrayUniqueByKey;
    },
    deleteComment: (state, action) => {
      state.activePost.comments = [
        ...(state.activePost.comments?.filter(
          (comment) => comment.id !== action.payload
        ) ?? []),
      ];
    },
    // updateReplies: (state, action) => {
    //   const { id: commentId, replies: newReplies } = action.payload;

    //   /** Not working :(
    //    * Because we cannot get the nested comment with just one id,
    //    * if we have structure like this
    //    * {
    //    *   id: 1,
    //    *   replies: [
    //    *     {
    //    *       id: 2,
    //    *       replies: []
    //    *     }
    //    *   ]
    //    * }
    //    *
    //    * then I cannot get id 2 comment without providing the id 1, as 2 is
    //    * nested inside, so we have to find a way to store all without nesting
    //    * and also able to fetch and display by nesting or otherwise!
    //    */

    //   // Update the comments recursively
    //   state.activePost.comments = updateRepliesRecursively(
    //     state.activePost.comments ?? [],
    //     commentId,
    //     newReplies
    //   );
    // },
    enableEditMode: (state) => {
      state.activePost.isEditMode = true;
    },
    disableEditMode: (state) => {
      state.activePost.isEditMode = false;
    },
  },
});

export const {
  createPost,
  deletePost,
  uploadAllPosts,
  updateComments,
  deleteComment,
  // updateReplies,
  enableEditMode,
  disableEditMode,
} = PostSlice.actions;

export default PostSlice;
