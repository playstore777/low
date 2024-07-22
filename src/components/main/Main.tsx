import { useEffect, useState } from "react";

import { getDocs, orderBy, query } from "firebase/firestore";

import Post from "../reusableComponents/post/Post";
import { storeRef } from "../../server/firebase";
import "./Main.css";
import { PostType } from "../../types/types";

const postQuery = query(storeRef, orderBy("createdAt", "desc"));

const Main = () => {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const querySnapshot = await getDocs(postQuery);
      const articlesList = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as PostType)
      );
      setPosts(articlesList);
    };
    fetchArticles();
  }, []);

  return (
    <main className="mainWrapper">
      {posts?.length > 0 &&
        posts.map((post) => (
          <Post
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
