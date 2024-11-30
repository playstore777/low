import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { Timestamp } from "firebase/firestore";

import type { RootState, AppDispatch } from "./configureStore";
import { Post, Comment } from "../types/types";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

let lastAllPosts: (Post & { createdAt?: number })[] = [];
let lastPostResult: Post[] = [];
let lastAllComments: (Comment & { timestamp?: number })[] = [];
let lastCommentResult: Comment[] = [];

// Memoized selector
export const selectAllPostsWithTimestamp = (state: RootState) => {
  const allPosts = state.post.allPosts;

  // Check if allPosts has changed
  if (allPosts !== lastAllPosts) {
    // Update the cached result
    lastAllPosts = allPosts;
    lastPostResult = allPosts.map((post) => ({
      ...post,
      createdAt: Timestamp.fromMillis(post?.createdAt ?? 0), // Convert back to _Timestamp
    }));
  }

  return lastPostResult;
};

export const selectAllCommentsWithTimestamp = (
  state: RootState,
  callback: (comments: Comment[]) => Comment[]
) => {
  const allComments = state.post.activePost.comments;

  // Check if allComments has changed
  if (allComments && allComments !== lastAllComments) {
    // Update the cached result
    lastAllComments = allComments;
    lastCommentResult = allComments?.map((comment) => ({
      ...comment,
      timestamp: Timestamp.fromMillis(comment.timestamp ?? 0), // Convert back to _Timestamp
    }));
  }

  return callback(lastCommentResult);
};

// export const selectAllCommentsWithTimestamp = (
//   state: RootState,
//   callback: (comments: Comment[]) => Comment[]
// ) => {
//   return createSelector(state.post.activePost.comments,
//     callback((comments: Comment[]) =>
//       comments?.map((comment) => ({
//         ...comment,
//         timestamp: Timestamp.fromMillis(comment.timestamp ?? 0),
//       }))
//     )
//   );
// };
