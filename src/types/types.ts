import { Timestamp } from "firebase/firestore";

export type Post = {
  id: string;
  title: string;
  content?: string;
  featuredImage?: string;
  description?: string;
  claps?: number;
  clappers?: { [userId: string]: number };
  createdAt?: Timestamp;
  userId: string;
  tags?: string[];
  comments?: Comment[];
};

export type User = {
  username?: string;
  photoURL?: string;
  bio?: string;
  followers?: [];
  notifications?: [];
  following?: [];
  uid: string;
  displayName: string;
};

export type Comment = {
  id: string;
  authorUid: string;
  postId?: string;
  parentId?: string; // parentComment Id
  text: string;
  timestamp: Timestamp;
  edited?: boolean;
  clapsCount: number;
  replies?: Comment[];
};

export type fetchDataMethod = (postId: string) => Promise<Post | undefined>;
