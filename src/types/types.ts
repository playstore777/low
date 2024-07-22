export type PostType = {
  id: string;
  title: string;
  content?: string;
  featuredImage?: string;
  description?: string;
};

export type fetchDataMethod = (postId: string) => Promise<PostType | undefined>;
