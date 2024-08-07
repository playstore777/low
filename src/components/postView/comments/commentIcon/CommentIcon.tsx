import ClapIcon from "../../../reusableComponents/clapIcon/ClapIcon";
import { useAuth } from "../../../../server/hooks/useAuth";
import { Comment } from "../../../../types/types";
import classes from "./CommentIcon.module.css";

const CommentIcon = ({
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
    <div className={classes.commentIconWrapper}>
      <div className={classes.commentIcon}>
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

export default CommentIcon;
