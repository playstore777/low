import {
  DocumentData,
  endBefore,
  limit,
  QueryDocumentSnapshot,
  serverTimestamp,
  startAfter,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

import MediumModalCross from "../../../../assets/images/MediumModalCross.svg";
import PostComment from "../../../reusableComponents/postComment/postComment";
import SvgWrapper from "../../../reusableComponents/svgWrapper/SvgWrapper";
import NewComment from "../../../reusableComponents/newComment/NewComment";
import { Comment, Post } from "../../../../types/types";
import classes from "./CommentsSection.module.css";
import {
  addCommentOrReply,
  fetchPaginatedCommentsAndReplies,
} from "../../../../server/services";
import InfiniteScroll from "react-infinite-scroller";

const CommentsSection = ({
  isOpen,
  post,
  onClose,
}: {
  isOpen: boolean;
  post: Post;
  onClose: () => void;
}) => {
  const commentModalRef = useRef(null);

  const [comments, setComments] = useState<Comment[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<
    DocumentData,
    DocumentData
  > | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    getComments();
  }, []);

  const getComments = async () => {
    const { comments, lastComment } = await fetchPaginatedCommentsAndReplies(
      post.id,
      null,
      {
        queries: [lastDoc ? startAfter(lastDoc) : endBefore(null), limit(3)],
      }
    );

    if (!comments.length) {
      // if no more posts
      setHasMore(false);
    } else {
      comments && setComments(comments);
      setLastDoc(lastComment);
    }
  };

  const onSubmitHandler = async (commentText: string, authorUid: string) => {
    const comment = {
      claps: {},
      clapCount: 0,
      text: commentText,
      authorUid,
      timestamp: serverTimestamp(),
    };
    await addCommentOrReply(post.id, comment);
    await getComments();
  };

  if (!isOpen) return null;

  return (
    <div
      className={classes.commentsSectionWrapper}
      onMouseDown={(e) => {
        const modalEdgeClicked =
          (e.target as HTMLElement) === commentModalRef.current;

        // Close modal if clicked outside of modal-content (i.e. the edge of modal)
        if (modalEdgeClicked) onClose();
      }}
      ref={commentModalRef}
    >
      <aside className={classes.aside}>
        <div className={classes.header}>
          <h2 className={classes.headerTitle}>Responses ({comments.length})</h2>
          <button onClick={onClose}>
            <SvgWrapper
              SvgComponent={MediumModalCross}
              className={classes.mediumCross}
              width="29px"
            />
          </button>
        </div>

        <div className={classes.newCommentWrapper}>
          <div className={classes.newComment}>
            <NewComment onSubmit={onSubmitHandler} />
          </div>

          <div className={classes.separator} />
          <InfiniteScroll
            loadMore={getComments}
            hasMore={hasMore}
            loader={<div key={0}>Loading...</div>}
          >
            {comments.length ? (
              <div className={classes.comments}>
                {comments.map((comment) => (
                  <PostComment post={post} comment={comment} key={comment.id} />
                ))}
              </div>
            ) : (
              <div className={classes.noComments}>
                <p>There are currently no responses for this story.</p>
                <p>Be the first to respond.</p>
              </div>
            )}
          </InfiniteScroll>
        </div>
      </aside>
    </div>
  );
};

export default CommentsSection;
