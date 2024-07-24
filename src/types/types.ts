export type Post = {
  id: string;
  title: string;
  content?: string;
  featuredImage?: string;
  description?: string;
  claps?: number;
  clappers?: { [userId: string]: number };
  createdAt?: Date;
  userId: string;
};

export type User = {
  photoURL?: string;
  bio?: string;
  followers?: [];
  notifications?: [];
  following?: [];
  uid: string;
  displayName: string;
};

export type fetchDataMethod = (postId: string) => Promise<Post | undefined>;
