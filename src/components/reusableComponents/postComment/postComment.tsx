import InfiniteScroll from "react-infinite-scroller";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  DocumentData,
  limit,
  QueryDocumentSnapshot,
  serverTimestamp,
  startAfter,
} from "firebase/firestore";

import {
  updateComments,
  deleteComment as deleteCommentFromRedux,
} from "../../../store/slices/postSlice";
import { useAppDispatch, useAppSelector } from "../../../store/rootReducer";
import { Comment, Post, User } from "../../../types/types";
import { useAuth } from "../../../server/hooks/useAuth";
import CommentBody from "../commentBody/CommentBody";
import NewComment from "../newComment/NewComment";
import classes from "./postComment.module.css";
import useUser from "../../hooks/useUser";
import {
  addCommentOrReply,
  clapComment,
  deleteComment,
  editComment,
  fetchPaginatedCommentsAndReplies,
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
  const dispatch = useAppDispatch();
  const replies =
    useAppSelector((state) =>
      state.post.activePost.comments?.filter((x) => x.parentId === comment.id)
    ) ?? [];

  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<
    DocumentData,
    DocumentData
  > | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [replying, setReplying] = useState(false);
  const [editingComment, setEditing] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const commentAuthor = useUser(comment.authorUid);

  useEffect(() => {
    getReplies();
  }, []);

  const getReplies = async () => {
    const { comments, lastComment } = await fetchPaginatedCommentsAndReplies(
      post.id,
      comment.id,
      {
        queries: [lastDoc ? startAfter(lastDoc) : limit(5)],
      }
    );

    if (comments.length === 0 || !lastComment) {
      // if no more posts
      setHasMore(false);
    } else {
      console.log("replies: ", comment.id, comments);
      dispatch(updateComments(comments));
      setLastDoc(lastComment);
    }
  };

  async function replyToComment(commentText: string) {
    // only logged in user can reply
    if (!currentUser) return;

    const reply = {
      claps: 0,
      clappers: {},
      text: commentText,
      authorUid: currentUser.uid,
      timestamp: serverTimestamp(),
    };

    const response = await addCommentOrReply(post.id, reply, comment.id);
    dispatch(updateComments([response]));
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
    dispatch(updateComments([commentDoc]));

    setEditing(false);
  };

  const onDeleteCommentHandler = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      dispatch(deleteCommentFromRedux(commentId));
      toast("Comment deleted successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  async function onClapHandler() {
    const commentDoc = {
      ...comment,
      claps: (comment.claps || 0) + 1,
      clappers: {
        [currentUser!.uid]:
          (comment.clappers ? comment?.clappers[currentUser!.uid] : 0) + 1,
      },
    };
    await clapComment(comment.id, commentDoc);
    await getReplies();
    dispatch(updateComments([commentDoc]));
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
        <div
          className={`${classes.reply} ${
            nestedLvl < 3 ? classes[`nestedReplyLevel${nestedLvl}`] : ""
          }`}
        >
          <InfiniteScroll
            loadMore={getReplies}
            hasMore={hasMore}
            loader={<div key={0}>Loading...</div>}
          >
            {((replies || []) as Comment[])?.map((reply) => (
              <PostComment
                comment={reply as Comment}
                post={post}
                nestedLvl={nestedLvl + 1}
                key={reply.id}
              />
            ))}
          </InfiniteScroll>
        </div>
      )}

      <div className={classes.end} />
    </div>
  );
};

export default PostComment;
