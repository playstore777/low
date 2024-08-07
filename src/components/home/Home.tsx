import { useEffect, useState } from "react";

import InfiniteScroll from "react-infinite-scroller";
import {
  startAfter,
  endBefore,
  limit,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";

import { useAppDispatch, useAppSelector } from "../../store/rootReducer";
import PostPreview from "../reusableComponents/post/PostPreview";
import { updateAllPosts } from "../../store/slices/postSlice";
import { fetchAllPosts } from "../../server/server";
import "./Home.css";

const Home = () => {
  const { allPosts } = useAppSelector((state) => state.post);
  const dispatch = useAppDispatch();

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
      dispatch(updateAllPosts(articlesList));
    }
  };

  useEffect(() => {
    fetchNewPosts();
  }, []);

  if (allPosts.length === 0 && !hasMore) {
    return <p className="text-grey text-center my-4">No stories found..</p>;
  }

  if (allPosts.length === 0) return null;

  return (
    <main className="mainWrapper">
      <InfiniteScroll
        loadMore={fetchNewPosts}
        hasMore={hasMore}
        loader={<div key={0}>Loading...</div>}
      >
        {allPosts?.length > 0 &&
          allPosts.map((post) => (
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

export default Home;
