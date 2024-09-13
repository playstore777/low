import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "../configureStore";
import { Comment, Post } from "../../types/types";

export type InitialState = {
  activePost: {
    title: string;
    content: string;
    isEditMode?: boolean;
    comments?: Comment[];
  };
  allPosts: Post[];
};

const initialState: InitialState = {
  activePost: {
    title: "",
    content: "",
    isEditMode: false,
    comments: [],
  },
  allPosts: [],
};

// // Recursive function to update replies at any level
// const updateRepliesRecursively = (
//   comments: Comment[],
//   targetCommentId: string,
//   newReplies: Comment[]
// ) => {
//   return comments.map((comment) => {
//     if (comment.id === targetCommentId) {
//       // Avoid duplication in replies
//       const newRepliesId = newReplies.map((reply) => reply.id);
//       const filteredPrevReplies = comment.replies?.filter(
//         (reply) => !newRepliesId.includes(reply.id)
//       );

//       // Update the replies of the comment
//       comment.replies = [...(filteredPrevReplies ?? []), ...newReplies];
//     } else if (comment.replies && comment.replies.length > 0) {
//       // Recursively update replies in nested comments
//       comment.replies = updateRepliesRecursively(
//         comment.replies,
//         targetCommentId,
//         newReplies
//       );
//     }
//     return comment;
//   });
// };

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

      const arrayUniqueByKey = [
        ...new Map(array.map((item) => [item[key], item])).values(),
      ];
      state.allPosts = arrayUniqueByKey;
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
export const showPost = (state: RootState) => state.post;

export default PostSlice;
