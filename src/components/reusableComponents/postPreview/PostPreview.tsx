import { useNavigate } from "react-router";

import "./PostPreview.css";

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

  const goTo = () => {
    navigate(`post/${id}`, {
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
        <div className="post-description">{description ?? ""}</div>
      </div>
      <div className="featured-image">
        <img src={featuredImage} />
      </div>
    </div>
  );
};

export default PostPreview;
