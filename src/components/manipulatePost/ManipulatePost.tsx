/**
 * @param {Props} props - The properties for rendering the post.
 * @param {boolean} [props.isNewPost] - Indicates if the post is new.
 * @param {Post} [props.post] - The post data.
 */
import { ChangeEvent, useEffect, useState } from "react";

import { useLocation } from "react-router";

import { createPost } from "../../store/slices/postSlice";
import { useAppDispatch } from "../../store/rootReducer";
import Editor from "../../packages/Editor/Editor";
import classes from "./ManipulatePost.module.css";
import { fetchPost } from "../../server/services";
import { Post } from "../../types/types";

interface props {
  isNewPost?: boolean;
  post?: Post;
}

const initialPostData = {
  title: "",
  content: "",
};

const ManipulatePost: React.FC<props> = ({ isNewPost = true, post }) => {
  const dispatch = useAppDispatch();
  // const { draftTimer } = useAppSelector((state) => state.post.activePost);
  const { state } = useLocation();
  post = state?.post;
  // const isDraft = state?.isDraft;
  // const { currentUser } = useAuth();

  const [postData, setPostData] = useState<{
    title: string;
    content: string;
  }>(initialPostData);
  // const [draftId, setDraftId] = useState<string>(post?.id ?? "");

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

  // const draftThePost = async (post: Partial<Post>) => {
  //   const htmlElement = post.content
  //     ? createElementFromHTML(post.content)
  //     : document.createElement("div");
  //   const imgElement = getFirstImageFromHTML(htmlElement);
  //   const postDoc = {
  //     title: post?.title ?? "",
  //     description: post?.description ?? "",
  //     content: post?.content ?? "",
  //     createdAt: serverTimestamp(),
  //     featuredImage: imgElement?.src ?? "",
  //     userId: currentUser?.uid,
  //     tags: post?.tags ?? "",
  //   };
  //   const response = await draftPost(draftId, postDoc as Post);
  //   if (response) {
  //     setDraftId(response.id);
  //     dispatch(createPost({ id: response.id }));
  //   }
  // };

  // // Debounced version of the function to store data in local storage
  // const debouncedStoreInLocalStorage = debounceWithReduxState(
  //   (data) => {
  //     const draft = {
  //       ...(data as { [key: string]: string }),
  //       id: draftId || "",
  //       authorId: currentUser?.uid,
  //     };
  //     draftThePost(draft);
  //   },
  //   5000,
  //   dispatch,
  //   draftTimer
  // );

  const onInputChange = (key: string, value: string) => {
    if (key) {
      dispatch(createPost({ [key]: value }));
      setPostData((prevData) => {
        if (!key) return prevData;

        const newData = { ...prevData, [key]: value };

        /**
         * NOTE:
         * Draft is working but needs some work, time consuming!
         * And it is also causing delay with not much difference
         * Will continue from here later, I will leave all the code
         * commented or uncommented for later in this commit!
         *
         * CODE:
         * (isNewPost || isDraft) && debouncedStoreInLocalStorage(newData);
         */

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
