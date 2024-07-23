export type Post = {
  id: string;
  title: string;
  content?: string;
  featuredImage?: string;
  description?: string;
  claps?: number;
  clappers?: { [userId: string]: number };
};

export type fetchDataMethod = (postId: string) => Promise<Post | undefined>;
