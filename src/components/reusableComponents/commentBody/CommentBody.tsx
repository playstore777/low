import { Link } from "react-router-dom";

import CommentInteractions from "../commentInteractions/CommentInteractions";
import Dropdown from "../dropdown/Dropdown";
import Button from "../button/Button";
import { Comment, Post, User } from "../../../types/types";
import { useAuth } from "../../../server/hooks/useAuth";
import classes from "./CommentBody.module.css";

const CommentBody = ({
  comment,
  replies,
  post,
  author,
  onEditComment,
  onDeleteComment,
  onReplyComment,
  onClapComment: onClap,
  onToggleOpenReplies,
  isRepliesOpen,
}: {
  comment: Comment;
  replies: Comment[];
  post: Post;
  author: User;
  onEditComment: () => void;
  onDeleteComment: () => void;
  onReplyComment: () => void;
  onClapComment: () => void;
  onToggleOpenReplies: () => void;
  isRepliesOpen: boolean;
}) => {
  const commentTimestamp = comment.timestamp
    ? comment.timestamp.toDate()
    : new Date(0);

  const { currentUser } = useAuth();

  const isAuthor = comment.authorUid === post.userId;
  const commentDate = commentTimestamp.toISOString();

  return (
    <>
      <div className={classes.commentWrapper}>
        <div className={classes.user}>
          <img
            width="8px"
            height="8px"
            alt="user"
            src={currentUser?.photoURL as string}
            loading="lazy"
          />
          <div className={classes.username}>
            <div>
              <Link to={`/u/${author.username}`}>{author.displayName}</Link>
              {isAuthor && <span className={classes.userHeader}>Author</span>}
            </div>
            <span
              className={classes.edited}
              title={commentTimestamp.toString()}
            >
              {commentDate}
              {comment.edited && " (edited)"}
            </span>
          </div>
        </div>

        {
          // only comment owner can edit/delete their comment
          comment.authorUid === currentUser?.uid && (
            <Dropdown>
              {/* edit icon here */}
              <>Edit Icon</>
              <div className={classes.actions}>
                <Button label="Edit this response" onClick={onEditComment} />
                <Button label="Delete" onClick={onDeleteComment} />
              </div>
            </Dropdown>
          )
        }
      </div>

      <p className={classes.commentBody}>{comment.text.trim()}</p>

      <CommentInteractions
        onReply={onReplyComment}
        onClap={onClap}
        comment={comment}
        onToggleOpenReplies={onToggleOpenReplies}
        isRepliesOpen={isRepliesOpen}
        replyCount={replies?.length || 0}
      />
    </>
  );
};

export default CommentBody;
