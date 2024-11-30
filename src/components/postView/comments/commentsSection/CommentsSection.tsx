/**
 * @param {Props} props - The properties for rendering the post.
 * @param {boolean} [props.isOpen] - Indicates if the comments section is open.
 * @param {Post} [props.post] - The post data.
 * @param {Function} [props.onClose] - Method triggered on close.
 */

import InfiniteScroll from "react-infinite-scroller";
import {
  DocumentData,
  limit,
  QueryDocumentSnapshot,
  serverTimestamp,
  startAfter,
} from "firebase/firestore";
import {
  FunctionComponent,
  SVGProps,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  selectAllCommentsWithTimestamp,
  useAppDispatch,
  useAppSelector,
} from "../../../../store/rootReducer";
import MediumModalCross from "../../../../assets/images/MediumModalCross.svg";
import PostComment from "../../../reusableComponents/postComment/postComment";
import SvgWrapper from "../../../reusableComponents/svgWrapper/SvgWrapper";
import NewComment from "../../../reusableComponents/newComment/NewComment";
import { updateComments } from "../../../../store/slices/postSlice";
import { Comment, Post } from "../../../../types/types";
import classes from "./CommentsSection.module.css";
import {
  addCommentOrReply,
  fetchPaginatedCommentsAndReplies,
} from "../../../../server/services";

interface props {
  isOpen: boolean;
  post: Post;
  onClose: () => void;
}

const CommentsSection: React.FC<props> = ({ isOpen, post, onClose }) => {
  const commentModalRef = useRef(null);
  const dispatch = useAppDispatch();
  const comments = useAppSelector((state) =>
    selectAllCommentsWithTimestamp(state, (commentsList) =>
      commentsList.filter((comment) => comment.parentId === "")
    )
  ) as Comment[];

  // const [comments, setComments] = useState<Comment[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<
    DocumentData,
    DocumentData
  > | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    getComments();
  }, []);

  const getComments = async () => {
    const { comments: newComments, lastComment } =
      await fetchPaginatedCommentsAndReplies(post.id, null, {
        // queries: [lastDoc ? startAfter(lastDoc) : endBefore(null), limit(3)],
        queries: [lastDoc ? startAfter(lastDoc) : limit(3)],
      });

    if (!newComments.length) {
      // if no more posts
      setHasMore(false);
    } else {
      // comments && setComments(comments);
      dispatch(updateComments(newComments));
      setLastDoc(lastComment);
    }
  };

  const onSubmitHandler = async (commentText: string, authorUid: string) => {
    const comment = {
      claps: 0,
      clappers: {},
      text: commentText,
      authorUid,
      timestamp: serverTimestamp(),
    };
    await addCommentOrReply(post.id, comment);
    await getComments();
    dispatch(updateComments([comment]));
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
          <h2 className={classes.headerTitle}>Responses</h2>
          <button onClick={onClose}>
            <SvgWrapper
              SvgComponent={
                MediumModalCross as unknown as FunctionComponent<
                  SVGProps<string>
                >
              }
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
                  <PostComment key={comment.id} post={post} comment={comment} />
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
