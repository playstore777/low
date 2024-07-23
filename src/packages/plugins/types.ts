export type Post = {
  id: string;
  title: string;
  content?: string;
  featuredImage?: string;
  description?: string;
};

export type fetchDataMethod = (postId: string) => Promise<Post | undefined>;
