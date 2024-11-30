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
  following?: string[];
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
  claps: number;
  clappers?: { [userId: string]: number };
  replies?: Comment[];
};

export type ClapPostComment = {
  claps?: number;
  clappers?: { [userId: string]: number };
};

export type fetchDataMethod = (postId: string) => Promise<Post | undefined>;

export type ContextMenuOptions = {
  url: string;
  author?: string;
  createdDate?: string;
  updatedDate?: string;
};

export type NestedAuthors = Map<string, { authorName: string }>;
