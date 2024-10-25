import { ChangeEvent, useEffect, useState } from "react";

import { useLocation } from "react-router";

import { debounceWithReduxState } from "../../utils/utils";
import { createPost } from "../../store/slices/postSlice";
import { useAppDispatch, useAppSelector } from "../../store/rootReducer";
import Editor from "../../packages/Editor/Editor";
import classes from "./ManipulatePost.module.css";
import { draftPost, fetchPost } from "../../server/services";
import { Post } from "../../types/types";
import { useAuth } from "../../server/hooks/useAuth";

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
  const { draftTimer } = useAppSelector((state) => state.post.activePost);
  const { state } = useLocation();
  post = state?.post;
  const { currentUser } = useAuth();

  const [postData, setPostData] = useState<{
    title: string;
    content: string;
  }>(initialPostData);
  const [draftId, setDraftId] = useState<string>("");

  useEffect(() => {
    if (!isNewPost) {
      const updatedPost = {
        title: post?.title ?? "",
        content: post?.content ?? "",
      };
      dispatch(createPost(updatedPost));
      setPostData(updatedPost);
    }
  }, [isNewPost, post]);

  const draftThePost = async (post: Partial<Post>) => {
    const response = await draftPost(post);
    if (response) {
      setDraftId(response.id);
      dispatch(createPost({ id: response.id }));
    }
  };

  // Debounced version of the function to store data in local storage
  const debouncedStoreInLocalStorage = debounceWithReduxState(
    (data) => {
      const draft = {
        ...(data as { [key: string]: string }),
        id: draftId || "",
        authorId: currentUser?.uid,
      };
      draftThePost(draft);
    },
    5000,
    dispatch,
    draftTimer
  );

  const onInputChange = (key: string, value: string) => {
    if (key) {
      dispatch(createPost({ [key]: value }));
      setPostData((prevData) => {
        if (!key) return prevData;

        const newData = { ...prevData, [key]: value };

        debouncedStoreInLocalStorage(newData);

        return newData;
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
