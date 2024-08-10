import ClapIcon from "../clapIcon/ClapIcon";
import { useAuth } from "../../../server/hooks/useAuth";
import { Comment } from "../../../types/types";
import classes from "./CommentInteractions.module.css";

const CommentInteractions = ({
  onClap,
  onToggleOpenReplies,
  onReply,
  comment,
  replyCount,
  isRepliesOpen,
}: {
  onClap: () => void;
  onToggleOpenReplies: () => void;
  onReply: () => void;
  comment: Comment;
  replyCount: number;
  isRepliesOpen: boolean;
}) => {
  const { currentUser, userLoggedIn } = useAuth();
  return (
    <div className={classes.commentInteractionsWrapper}>
      <div className={classes.commentInteractions}>
        <ClapIcon
          label={comment.clapsCount}
          disabled={currentUser?.uid === comment.authorUid || !userLoggedIn}
          onClick={onClap}
        />
        {replyCount ? (
          <button className={classes.replyBtn} onClick={onToggleOpenReplies}>
            {/* <i className="fa-regular fa-comment text-[1.2rem] rotate-y-180 thinner-icon" /> */}
            {isRepliesOpen ? "Hide replies" : `${replyCount} replies`}
          </button>
        ) : null}
      </div>

      <button onClick={() => onReply()}>Reply</button>
    </div>
  );
};

export default CommentInteractions;
