import { FunctionComponent, SVGProps, useState } from "react";

import { Link } from "react-router-dom";

import CommentInteractions from "../commentInteractions/CommentInteractions";
import ThreeDots from "../../../assets/images/MediumThreeDots.svg";
import { Comment, Post, User } from "../../../types/types";
import { useAuth } from "../../../server/hooks/useAuth";
import SvgWrapper from "../svgWrapper/SvgWrapper";
import classes from "./CommentBody.module.css";
import { Timestamp } from "firebase/firestore";
import Dropdown from "../dropdown/Dropdown";
import Button from "../button/Button";
import Avatar from "../avatar/Avatar";
import PopUp from "../popup/PopUp";

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
  const commentTimestamp =
    comment.timestamp instanceof Timestamp
      ? comment.timestamp.toDate()
      : new Date(
          (comment.timestamp as { seconds: number; nanoseconds: number })
            ?.seconds * 1000 || 0
        );

  const { currentUser } = useAuth();

  const isAuthor = comment.authorUid === post.userId;
  const commentDate = commentTimestamp.toISOString();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const updateShowDeleteModal = () => {
    setShowDeleteModal(true);
  };

  return (
    <>
      <div className={classes.commentWrapper}>
        <div className={classes.user}>
          <Avatar imgSrc={currentUser?.photoURL as string} imgTitle="user" />
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
              <SvgWrapper
                SvgComponent={
                  ThreeDots as unknown as FunctionComponent<SVGProps<string>>
                }
                width="24px"
              />
              <div className={classes.actions}>
                <Button label="Edit this response" onClick={onEditComment} />
                <Button label="Delete" onClick={updateShowDeleteModal} />
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
      <PopUp
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
        }}
      >
        <div className={classes.deleteConfirm}>
          <header>Delete Comment</header>
          <main>
            Deletion is not reversible, and the comment will be completely
            deleted.
          </main>
          <footer>
            <Button
              label="Cancel"
              className={classes.cancelBtn}
              onClick={() => {
                setShowDeleteModal(false);
              }}
            />
            <Button
              label="Delete"
              className={classes.deleteBtn}
              onClick={onDeleteComment}
            />
          </footer>
        </div>
      </PopUp>
    </>
  );
};

export default CommentBody;
