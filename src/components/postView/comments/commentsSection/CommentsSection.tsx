import { serverTimestamp } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

import MediumModalCross from "../../../../assets/images/MediumModalCross.svg";
import PostComment from "../../../reusableComponents/postComment/postComment";
import SvgWrapper from "../../../reusableComponents/svgWrapper/SvgWrapper";
import NewComment from "../../../reusableComponents/newComment/NewComment";
import { Comment, Post } from "../../../../types/types";
import classes from "./CommentsSection.module.css";
import {
  addCommentOrReply,
  fetchCommentsAndReplies,
} from "../../../../server/services";

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

  useEffect(() => {
    getComments();
  }, []);

  const getComments = async () => {
    const comments = await fetchCommentsAndReplies(post.id);
    comments && setComments(comments);
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
        </div>
      </aside>
    </div>
  );
};

export default CommentsSection;
