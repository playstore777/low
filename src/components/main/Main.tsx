import { useEffect, useState } from "react";

import PostPreview from "../reusableComponents/post/PostPreview";
import { Post } from "../../types/types";
import "./Main.css";
import { fetchAllPosts } from "../../server/server";

const Main = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const articlesList = await fetchAllPosts();
      setPosts(articlesList);
    };
    fetchArticles();
  }, []);

  return (
    <main className="mainWrapper">
      {posts?.length > 0 &&
        posts.map((post) => (
          <PostPreview
            key={post.id}
            id={post.id}
            title={post.title || ""}
            content={post.content || ""}
            description={post.description || ""}
            featuredImage={post.featuredImage || ""}
          />
        ))}
    </main>
  );
};

export default Main;
