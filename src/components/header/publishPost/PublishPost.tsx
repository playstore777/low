import { useEffect, useRef, useState } from "react";

import { serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { User } from "firebase/auth";

import { createElementFromHTML } from "../../../utils/utils";
import Button from "../../reusableComponents/button/Button";
import { useAppSelector } from "../../../store/rootReducer";
import { useAuth } from "../../../server/hooks/useAuth";
import { addPost } from "../../../server/services";
import classes from "./PublishPost.module.css";

const PublishPost = ({ onClose }: { onClose: () => void }) => {
  const post = useAppSelector((state) => state.post);
  const navigate = useNavigate();
  const { currentUser: user } = useAuth();

  const [topicStr, setTopicStr] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const tooManyTopics = topics.length >= 5;
  const topicRegx = /^$|^[A-Za-z0-9 _-]+$/;

  useEffect(() => {
    const htmlElement = createElementFromHTML(post.activePost.content);
    const imgElement = htmlElement.querySelector("img");
    imgElement && setFeaturedImage(imgElement.src);
  }, [post.activePost.content]);

  const addTopic = (topic: string) => {
    topic = topic.trim();
    if (tooManyTopics || !topic) return;
    const isDuplicate = topics.some(
      (t) => t.toLowerCase() === topic.toLowerCase()
    );
    if (isDuplicate) return;

    setTopics([...topics, topic]);
    setTopicStr("");
  };

  const removeTopic = (topic: string) => {
    setTopics((prevState) =>
      prevState.filter((filteredTopic) => filteredTopic !== topic)
    );
  };

  function onTopicChange(value: string) {
    // if last key pressed is double space or comma
    if (value.slice(-2) === "  " || value.slice(-1) === ",") {
      // remove the trailing comma before adding topic
      addTopic(value.replace(",", ""));
    } else if (topicRegx.test(value) && value.length <= 25) {
      setTopicStr(value);
    }
  }

  const handleSubmitData = async () => {
    if (!post.activePost.title && !post.activePost.content) {
      console.error(
        "Publishing will become available after you start writing."
      );
      return;
    }
    const title = titleRef?.current?.value.trim() || post.activePost.title;
    const description = descriptionRef?.current?.value || "";
    const document = {
      title,
      description,
      content: post.activePost.content,
      createdAt: serverTimestamp(),
      featuredImage,
      userId: (user! as User).uid,
      tags: topics,
    };

    // console.log(document);
    const response = await addPost(document);
    if (response) {
      toast("Story has been published!");
      onClose();
      response.id && navigate(`post/${response.id}`);
    } else {
      toast("Story is not published due to an error!");
    }
  };

  return (
    <div className={classes.publishPostWrapper}>
      <div className={classes.story}>
        <div className={classes.storyPreview}>
          <b className={classes.heading}>Story Preview</b>
          <div className={classes.featuredImageWrapper}>
            <div className={classes.featuredImageContainer}>
              {featuredImage ? (
                <img
                  src={featuredImage}
                  alt={post.activePost.title}
                  className={classes.featuredImage}
                />
              ) : (
                <span className={classes.thumbnail}>
                  Include a high-quality image in your story to make it more
                  inviting to readers.
                </span>
              )}
            </div>
          </div>
          <div className={classes.storyTitle}>
            <input
              ref={titleRef}
              id="title"
              type="text"
              maxLength={100}
              placeholder="Write a preview title"
              className={classes.storyInput}
            />
          </div>
          <div className={classes.storyDescription}>
            <input
              ref={descriptionRef}
              id="description"
              type="text"
              maxLength={140}
              placeholder="Write a preview subtitle"
              className={classes.storyInput}
            />
          </div>
        </div>

        <div className={classes.misc}>
          <p className={classes.heading}>
            Publishing to:{" "}
            <b className={classes.username}>{(user! as User)?.displayName}</b>
          </p>
          <form
            className={classes.form}
            onSubmit={(e) => {
              e.preventDefault();
              addTopic(topicStr);
            }}
          >
            <label htmlFor="topic">
              Add topics (up to 5) so readers know what your story is about
            </label>

            <div className={classes.topics}>
              {topics.map((topic) => (
                <div className={classes.topicContainer} key={topic}>
                  <span className={classes.topic}>{topic}</span>
                  <button
                    type="button"
                    className={classes.removeTopicBtn}
                    onClick={() => removeTopic(topic)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <input
              id="topic"
              placeholder={
                tooManyTopics ? "Maximum topics reached." : "Add a topic..."
              }
              className={classes.topicInput}
              onChange={(e) => onTopicChange(e.target.value)}
              value={topicStr}
              disabled={tooManyTopics}
              title={
                tooManyTopics ? "You can only add up to 5 topics." : undefined
              }
            />
          </form>
          <div className={classes.action}>
            <Button
              label="Publish Now"
              style={{ color: "white", padding: "0.7rem 1.1rem" }}
              onClick={handleSubmitData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishPost;
