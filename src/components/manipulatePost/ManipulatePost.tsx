import { ChangeEvent, useEffect, useState } from "react";

import Editor from "../../packages/Editor/Editor";
import classes from "./ManipulatePost.module.css";
import { useAppDispatch } from "../../store/rootReducer";
import { createPost } from "../../store/slices/postSlice";
import { Post } from "../../types/types";
import { useLocation } from "react-router";
import { fetchPost } from "../../server/server";

const initialPostData = {
  title: "",
  content: "",
};

const ManipulatePost = ({
  isNewPost = true,
  post,
}: {
  isNewPost?: boolean;
  post?: Post;
}) => {
  const dispatch = useAppDispatch();
  const { state } = useLocation();
  post = state?.post;

  const [postData, setPostData] = useState<{
    title: string;
    content: string;
  }>(initialPostData);

  useEffect(() => {
    if (!isNewPost) {
      const updatedPost = {
        title: post?.title ?? "",
        content: post?.content ?? "",
      };
      dispatch(createPost(updatedPost));
      setPostData(updatedPost);
      console.log(updatedPost);
    }
  }, [isNewPost, post]);

  const onInputChange = (key: string, value: string) => {
    if (key) {
      dispatch(createPost({ [key]: value }));
      setPostData((prevData) => {
        return { ...prevData, [key]: value };
      });
    }
  };

  const setTitleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    onInputChange("title", e.target.value);
  };

  return (
    <>
      <div className={classes.titleField}>
        <input
          type="text"
          name="post-title"
          className={classes.titleInput}
          maxLength={150}
          value={postData.title}
          onChange={setTitleOnChange}
        />
      </div>
      <div className={classes.editor}>
        <Editor
          namespace="new-post-editor"
          initialEditorState={post?.content}
          fetchPost={fetchPost}
          onInputChange={onInputChange}
        />
      </div>
    </>
  );
};

export default ManipulatePost;
