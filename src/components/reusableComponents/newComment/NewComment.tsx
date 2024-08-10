import { useState, FormEvent } from "react";

import Button from "../../reusableComponents/button/Button";
import { useAuth } from "../../../server/hooks/useAuth";
import TextButton from "../textButton/TextButton";
import classes from "./NewComment.module.css";

const NewComment = ({
  onSubmit,
  onCancel,
  initialText = "",
  placeholder = "What are your thoughts?",
  hideUserInfo,
}: {
  onSubmit: (commentText: string, userId: string) => Promise<void>;
  onCancel?: () => void;
  initialText?: string;
  placeholder?: string;
  hideUserInfo?: boolean;
}) => {
  const { currentUser } = useAuth();
  const [commentText, setCommentText] = useState(initialText);
  const [expanded, setExpanded] = useState(!!currentUser);
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    setExpanded(false);
    setCommentText("");
    onCancel && onCancel();
  };

  const onSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser || !commentText || loading) return;

    setLoading(true);

    await onSubmit(commentText, currentUser.uid);

    setExpanded(false);
    setLoading(false);
    setCommentText("");
  };

  return (
    <form className={classes.newCommentWrapper} onSubmit={onSubmitHandler}>
      {hideUserInfo || !expanded ? null : (
        <div className={classes.user}>
          <img
            alt="user-fotu" // intentional!!
            src={currentUser?.photoURL as string}
            loading="lazy"
          />
          <span>{currentUser?.displayName}</span>
        </div>
      )}

      <div
        className={`${classes.comment} ${
          expanded ? classes.allowComment : classes.dontAllowComment
        } `}
        onClick={() => {
          if (!currentUser) {
            alert("show Sign up popup here!");
          } else setExpanded(true);
        }}
      >
        <textarea
          placeholder={placeholder}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={!currentUser}
          className={classes.commentArea}
        />
      </div>

      {expanded && (
        <div className={`${classes.actions}`}>
          <TextButton label="Cancel" onClick={handleCancel} />
          <Button
            label="Respond"
            type="submit"
            disabled={loading || !commentText}
          />
        </div>
      )}
    </form>
  );
};

export default NewComment;
