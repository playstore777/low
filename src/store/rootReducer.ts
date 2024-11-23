import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { Timestamp } from "firebase/firestore";

import type { RootState, AppDispatch } from "./configureStore";
import { Post } from "../types/types";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

let lastAllPosts: (Post & { createdAt?: number })[] = [];
let lastResult: Post[] = [];

// Memoized selector
export const selectAllPostsWithTimestamp = (state: RootState) => {
  const allPosts = state.post.allPosts;

  // Check if allPosts has changed
  if (allPosts !== lastAllPosts) {
    // Update the cached result
    lastAllPosts = allPosts;
    lastResult = allPosts.map((post) => ({
      ...post,
      createdAt: Timestamp.fromMillis(post?.createdAt ?? 0), // Convert back to _Timestamp
    }));
  }

  return lastResult;
};
