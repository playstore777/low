export type Post = {
  id: string;
  title: string;
  content?: string;
  featuredImage?: string;
  description?: string;
  userId?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export type Post = any;

export type fetchDataMethod = (postId: string) => Promise<Post | undefined>;
