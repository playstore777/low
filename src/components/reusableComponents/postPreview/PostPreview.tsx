import { useNavigate } from "react-router";

import "./PostPreview.css";
import { useEffect, useState } from "react";

interface PostProps {
  id: string;
  title: string;
  content: string;
  description?: string;
  featuredImage?: string;
}

const PostPreview: React.FC<PostProps> = ({
  id,
  title,
  content,
  description,
  featuredImage,
}) => {
  /*
   * missing Author details and Post creation etc meta info.
   */
  const navigate = useNavigate();

  const [shortDesc, setShortDesc] = useState(description);

  useEffect(() => {
    if (!description?.trim()) {
      const div = document.createElement("div");
      div.innerHTML = content;
      const { textContent } = div;
      setShortDesc(textContent?.slice(0, 300));
    }
  }, [description, content]);

  const goTo = () => {
    navigate(`/post/${id}`, {
      state: { post: { title, content } },
    });
    if (typeof window !== "undefined" && window?.scrollTo) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="post" onClick={goTo}>
      <div className="text-content">
        <div className="post-title">{title}</div>
        <div className="post-description">{shortDesc}</div>
      </div>
      <div className="featured-image">
        {featuredImage && <img src={featuredImage} />}
      </div>
    </div>
  );
};

export default PostPreview;
