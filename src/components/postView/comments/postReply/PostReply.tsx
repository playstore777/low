import { Comment, Post } from "../../../../types/types";
import PostComment from "../postComment/postComment";

const PostReply = ({
  replies,
  post,
  currentNestedLvl,
  className = "",
}: {
  replies: Comment[];
  post: Post;
  currentNestedLvl: number;
  className?: string;
}) => {
  return (
    <div className={className}>
      {replies.map((reply) => (
        <PostComment
          comment={reply as Comment}
          post={post}
          nestedLvl={currentNestedLvl + 1}
          key={reply.id}
        />
      ))}
    </div>
  );
};

export default PostReply;
