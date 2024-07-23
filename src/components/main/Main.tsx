import { useEffect, useState } from "react";

import { getDocs, orderBy, query } from "firebase/firestore";

import PostPreview from "../reusableComponents/post/PostPreview";
import { storeRef } from "../../server/firebase";
import "./Main.css";
import { Post } from "../../types/types";

const postQuery = query(storeRef, orderBy("createdAt", "desc"));

const Main = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const querySnapshot = await getDocs(postQuery);
      const articlesList = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Post)
      );
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
