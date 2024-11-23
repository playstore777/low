import { useNavigate } from "react-router";

import "./PostPreview.css";
import { useEffect, useState } from "react";
import { Post } from "../../../types/types";

interface PostProps {
  post: Post;
  isDraft?: boolean;
}

const PostPreview: React.FC<PostProps> = ({ post, isDraft }) => {
  /*
   * missing Author details and Post creation etc meta info.
   */
  const navigate = useNavigate();

  const [shortDesc, setShortDesc] = useState(post?.description);

  useEffect(() => {
    if (!post?.description?.trim()) {
      const div = document.createElement("div");
      div.innerHTML = post?.content ?? "";
      const { textContent } = div;
      setShortDesc(textContent?.slice(0, 300));
    }
  }, [post]);

  const goTo = () => {
    navigate(`/post/${post?.id}`, {
      state: { post, isDraft },
    });
    if (typeof window !== "undefined" && window?.scrollTo) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="post" onClick={goTo}>
      <div className="text-content">
        <div className="post-title">{post?.title}</div>
        <div className="post-description">{shortDesc}</div>
      </div>
      <div className="featured-image">
        {post?.featuredImage && <img src={post?.featuredImage} />}
      </div>
    </div>
  );
};

export default PostPreview;
