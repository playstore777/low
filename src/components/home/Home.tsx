/**
 * @param {null} props - Unused props
 */

import React, { useEffect, useRef, useState } from "react";

import {
  startAfter,
  limit,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";

import { clearAllPosts, uploadAllPosts } from "../../store/slices/postSlice";
import PostPreview from "../reusableComponents/postPreview/PostPreview";
import { fetchAllPosts } from "../../server/services";
import {
  selectAllPostsWithTimestamp,
  useAppDispatch,
  useAppSelector,
} from "../../store/rootReducer";
import "./Home.css";

interface props {}

const Home: React.FC<props> = () => {
  const allPosts = useAppSelector(selectAllPostsWithTimestamp);
  const dispatch = useAppDispatch();

  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<
    DocumentData,
    DocumentData
  > | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | undefined>();

  const fetchNewPosts = async () => {
    const { articlesList, lastArticle } = await fetchAllPosts(
      lastDoc ? startAfter(lastDoc) : limit(3)
    );
    // if no more posts
    if (!articlesList.length) {
      setHasMore(false);
    } else {
      setLastDoc(lastArticle);
      dispatch(uploadAllPosts(articlesList));
    }
  };

  const lastElementRef = (element: HTMLDivElement | null) => {
    if (hasMore) {
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchNewPosts();
        }
      });
      if (element) {
        observer.current.observe(element);
      }
    }
  };

  useEffect(() => {
    fetchNewPosts();
    return () => {
      dispatch(clearAllPosts());
    };
  }, []);

  if (allPosts.length === 0 && !hasMore) {
    return <p className="text-grey text-center my-4">No stories found..</p>;
  }

  if (allPosts.length === 0) return null;

  return (
    <main className="mainWrapper">
      {allPosts?.length > 0 &&
        allPosts.map((post, index) => (
          <PostPreview
            key={post.id}
            ref={index + 1 === allPosts.length ? lastElementRef : null}
            post={post}
          />
        ))}

      {!hasMore && <p className="end-of-list">You've reached the end</p>}
    </main>
  );
};

export default Home;
