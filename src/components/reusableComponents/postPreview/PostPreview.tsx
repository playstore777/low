import { useNavigate } from "react-router";

import "./PostPreview.css";
import { forwardRef, useEffect, useState } from "react";
import { Post } from "../../../types/types";

interface PostProps {
  post: Post;
  isDraft?: boolean;
}

const PostPreview = forwardRef<HTMLDivElement, PostProps>(
  ({ post, isDraft }, ref) => {
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
      <div ref={ref} className="post" onClick={goTo}>
        <div className="text-content">
          <div className="post-title">{post?.title}</div>
          <div className="post-description">{shortDesc}</div>
        </div>
        <div className="featured-image">
          {post?.featuredImage && (
            <img src={post?.featuredImage} alt={post.title} loading="lazy" />
          )}
        </div>
      </div>
    );
  }
);

export default PostPreview;
