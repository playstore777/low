import { useEffect, useState } from "react";

import {
  startAfter,
  endBefore,
  limit,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import InfiniteScroll from "react-infinite-scroller";

import PostPreview from "../reusableComponents/post/PostPreview";
import { fetchAllPosts } from "../../server/server";
import { Post } from "../../types/types";
import "./Main.css";

const Main = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<
    DocumentData,
    DocumentData
  > | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchNewPosts = async () => {
    // if reached bottom, fetch new posts.
    const { articlesList, lastArticle } = await fetchAllPosts(
      lastDoc ? startAfter(lastDoc) : endBefore(null),
      limit(3)
    );
    // if no more posts
    if (!articlesList.length) {
      setHasMore(false);
    } else {
      setLastDoc(lastArticle);
      // Avoid duplication
      setPosts((prevPosts) => {
        const newPostIds = articlesList.map((post) => post.id);
        const filteredPrevPosts = prevPosts.filter(
          (post) => !newPostIds.includes(post.id)
        );
        return [...filteredPrevPosts, ...articlesList];
      });
    }
  };

  useEffect(() => {
    fetchNewPosts();
  }, []);

  if (posts == null && !hasMore) {
    return <p className="text-grey text-center my-4">No stories found..</p>;
  }

  if (posts == null) return null;

  return (
    <main className="mainWrapper">
      <InfiniteScroll
        loadMore={fetchNewPosts}
        hasMore={hasMore}
        loader={<div key={0}>Loading...</div>}
      >
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
      </InfiniteScroll>

      {!hasMore && <p className="end-of-list">You've reached the end</p>}
    </main>
  );
};

export default Main;
