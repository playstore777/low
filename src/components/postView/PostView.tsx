import { useEffect, useState } from "react";

import { useLocation, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

import HtmlContentDisplay from "../../packages/HtmlContentDisplay/HtmlContentDisplay";
import ThreeDots from "../../assets/images/MediumThreeDots.svg";
import Dropdown from "../reusableComponents/dropdown/Dropdown";
import SvgWrapper from "../reusableComponents/svg/SvgWrapper";
import { enableEditMode } from "../../store/slices/postSlice";
import {
  clapPost,
  deletePost,
  fetchPost,
  getUserById,
} from "../../server/server";
import Button from "../reusableComponents/button/Button";
import { useAppDispatch } from "../../store/rootReducer";
import PopUp from "../reusableComponents/popup/PopUp";
import Clap from "../../assets/images/MediumClap.svg";
import { useAuth } from "../../server/hooks/useAuth";
import classes from "./PostView.module.css";
import { Post } from "../../types/types";

const PostView = ({ post }: { post?: Post }) => {
  const { userLoggedIn, currentUser } = useAuth();
  const { postId } = useParams();
  const { state } = useLocation();
  post = state?.post;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [postContent, setPostContent] = useState<Post>({
    id: postId!,
    title: post?.title ?? "",
    content: post?.content,
    claps: post?.claps ?? 0,
    userId: post?.userId ?? "",
    createdAt: post?.createdAt,
  });
  const [contentAuthor, setContentAuthor] = useState({
    name: "",
    username: "",
    photoURL: "",
    id: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAuthorUser, setIsAuthorUser] = useState(
    currentUser?.uid === contentAuthor.id
  );
  const [isClapped, setIsClapped] = useState(false);

  //#region main/root post fetch using id
  useEffect(() => {
    const getPost = async () => {
      try {
        const post = await fetchPost(postId!);
        if (post) {
          if (post.userId) {
            const authorDetails = await getUserById(post.userId);
            setContentAuthor({
              id: authorDetails?.uid as string,
              name: authorDetails?.displayName as string,
              username: "",
              photoURL: authorDetails?.photoURL as string,
            });
          }
          setPostContent((prev) => ({
            ...prev,
            title: post.title,
            content: post.content,
            claps: post.claps,
            clappers: post.clappers,
            userId: post.userId,
            createdAt: new Date(post.createdAt!.seconds * 1000),
          }));
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    // if (!post?.title) {
    getPost();
    // }
  }, [post?.title, postId]);
  //#endregion

  useEffect(() => {
    let timer = undefined;
    if (isClapped && currentUser && !timer) {
      timer = setTimeout(async () => {
        const body = {
          claps: postContent.claps,
          clappers: postContent.clappers,
        };
        await clapPost(postContent.id, body);
        setIsClapped(false);
      }, 3000);
    }

    return () => {
      clearTimeout(timer);

      /**
       * If this clean up function gets triggered before timeout, then API will not be called and that will cause the data to be unsycronised or in simple Backend data will not get updated.
       *
       * So we are calling the API if timeout is cleared and also clapped, if new claps data is available to be updated in the backend.
       */
      if (isClapped) {
        /** Increasing claps and clappers by 1, because this is getting executed before state updation*/
        const clappers = {
          [currentUser?.uid as string]:
            postContent.clappers![currentUser?.uid as string] + 1,
        };
        const body = {
          claps: postContent.claps! + 1,
          clappers: clappers,
        };
        clapPost(postContent.id, body);
      }
    };
  }, [
    currentUser,
    isClapped,
    postContent.clappers,
    postContent.claps,
    postContent.id,
  ]);

  useEffect(() => {
    setIsAuthorUser(currentUser?.uid === contentAuthor.id);
  }, [contentAuthor.id, currentUser?.uid]);

  const onEditHandler = () => {
    const content = document.querySelector(".content");
    dispatch(enableEditMode());
    navigate("edit", {
      state: {
        post: { title: post?.title, content: content?.innerHTML },
      },
    });
  };

  const onDeleteHandler = async () => {
    setShowDeleteModal(true);
  };

  const onClapHandler = () => {
    !isClapped && setIsClapped(true);
    setPostContent((prev) => ({
      ...prev,
      claps: (prev.claps || 0) + 1,
      clappers: {
        [currentUser!.uid]:
          (prev.clappers ? prev?.clappers[currentUser!.uid] : 0) + 1,
      },
    }));
  };

  const onDeletePostHandler = async () => {
    try {
      await deletePost(postId!);
      toast("Story has been deleted!");
      navigate("/");
    } catch (e) {
      toast("Error deleting the Story!");
    }
  };

  return (
    <>
      {postContent?.title && (
        <h1
          //   className={attr?.className?.title ?? "title"}
          style={{
            fontSize: "2.5rem",
            fontFamily: `sohne, "Helvetica Neue", Helvetica, Arial, sans-serif`,
            padding: "1rem 0",
          }}
        >
          {postContent.title}
        </h1>
      )}
      <div className={classes.authorDetails}>
        <div className={classes.avatar}>
          {!contentAuthor?.photoURL && (
            <div className={classes.avatarPlaceholder}></div>
          )}
          {contentAuthor?.photoURL && (
            <img alt="" src={contentAuthor?.photoURL} loading="lazy" />
          )}
        </div>
        <div>
          <div className="authorName">{contentAuthor.name}</div>
          <div className="createdDate">
            {postContent.createdAt && postContent.createdAt.toISOString()}
          </div>
        </div>
      </div>
      <div className={classes.postInteractions}>
        <div className={classes.clap}>
          <SvgWrapper
            SvgComponent={Clap}
            width="24px"
            disabled={isAuthorUser || !userLoggedIn}
            onClick={onClapHandler}
          />
          {postContent.claps}
        </div>
        <Dropdown buttonStyles={classes.buttonStyles}>
          <SvgWrapper SvgComponent={ThreeDots} width="24px" />
          <div className="dropdownItems">
            {userLoggedIn && isAuthorUser && (
              <div
                className="dropdownItem"
                onClick={onEditHandler}
                tabIndex={0}
              >
                Edit
              </div>
            )}
            {userLoggedIn && isAuthorUser && (
              <div
                className="dropdownItem"
                tabIndex={0}
                onClick={onDeleteHandler}
              >
                Delete
              </div>
            )}
            <div className="dropdownItem" tabIndex={0}>
              3
            </div>
            <div className="dropdownItem" tabIndex={0}>
              4
            </div>
          </div>
        </Dropdown>
      </div>
      <HtmlContentDisplay post={postContent} />
      <PopUp
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
        }}
      >
        <div className={classes.deleteConfirm}>
          <header>Delete Story</header>
          <main>
            Deletion is not reversible, and the story will be completely
            deleted. If you do not want to delete, you can&nbsp;
            <u>unlist the story</u>.
          </main>
          <footer>
            <Button
              label="Cancel"
              className={classes.cancelBtn}
              onClick={() => {
                setShowDeleteModal(false);
              }}
            />
            <Button
              label="Delete"
              className={classes.deleteBtn}
              onClick={onDeletePostHandler}
            />
          </footer>
        </div>
      </PopUp>
    </>
  );
};

export default PostView;
