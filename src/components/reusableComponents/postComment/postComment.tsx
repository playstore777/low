import { serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";

import { Comment, Post, User } from "../../../types/types";
import { useAuth } from "../../../server/hooks/useAuth";
import CommentBody from "../commentBody/CommentBody";
import NewComment from "../newComment/NewComment";
import PostReply from "../../postView/comments/postReply/PostReply";
import classes from "./postComment.module.css";
import useUser from "../../hooks/useUser";
import { toast } from "react-toastify";
import {
  addCommentOrReply,
  deleteComment,
  editComment,
  fetchCommentsAndReplies,
} from "../../../server/services";

const PostComment = ({
  post,
  comment,
  nestedLvl = 0,
}: {
  post: Post;
  comment: Comment;
  nestedLvl?: number;
}) => {
  const { currentUser } = useAuth();

  const [replies, setReplies] = useState<Comment[]>([]);
  const [replying, setReplying] = useState(false);
  const [editingComment, setEditing] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const commentAuthor = useUser(comment.authorUid);

  useEffect(() => {
    getReplies();
  }, []);

  const getReplies = async () => {
    const comments = await fetchCommentsAndReplies(post.id, comment.id);
    comments && setReplies(comments);
  };

  async function replyToComment(commentText: string) {
    // only logged in user can reply
    if (!currentUser) return;

    const reply = {
      likes: {},
      likeCount: 0,
      text: commentText,
      authorUid: currentUser.uid,
      timestamp: serverTimestamp(),
    };

    await addCommentOrReply(post.id, reply, comment.id);

    setReplying(false);
    setShowReplies(true);
  }

  const onEditHandler = async (newCommentText: string) => {
    const commentDoc = {
      ...comment,
      text: newCommentText,
      edited: true,
    };
    await editComment(post.id, commentDoc);
    await getReplies();

    setEditing(false);
  };

  const onDeleteCommentHandler = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      toast("Comment deleted successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  async function onClapHandler() {
    // await clapComment(commentPath, currentUser?.uid);
  }

  if (commentAuthor == null) return null;

  return (
    <div className={classes.postCommentWrapper}>
      <div className={classes.postComment}>
        {editingComment ? (
          <NewComment
            initialText={comment.text}
            onSubmit={onEditHandler}
            onCancel={() => setEditing(false)}
            hideUserInfo
          />
        ) : (
          <CommentBody
            comment={comment}
            replies={replies as Comment[]}
            post={post}
            author={commentAuthor as User}
            onEditComment={() => setEditing(true)}
            onDeleteComment={() => onDeleteCommentHandler(comment.id)}
            onReplyComment={() => setReplying(!replying)}
            onClapComment={onClapHandler}
            onToggleOpenReplies={() => setShowReplies(!showReplies)}
            isRepliesOpen={showReplies}
          />
        )}
      </div>

      {replying && (
        <div className={nestedLvl < 3 ? classes.replying : undefined}>
          <NewComment
            placeholder={`Replying to ${commentAuthor.displayName}`}
            hideUserInfo
            onCancel={() => setReplying(false)}
            onSubmit={replyToComment}
          />
        </div>
      )}

      {showReplies && (
        <PostReply
          currentNestedLvl={nestedLvl}
          post={post}
          replies={(replies || []) as Comment[]}
          className={classes.reply + (nestedLvl < 3 && classes.nestedReply)}
        />
      )}

      <div className={classes.end} />
    </div>
  );
};

export default PostComment;
