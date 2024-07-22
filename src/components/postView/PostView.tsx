import { useEffect, useState } from "react";

import { useLocation, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

import HtmlContentDisplay from "../../packages/HtmlContentDisplay/HtmlContentDisplay";
import ThreeDots from "../../assets/images/MediumThreeDots.svg";
import Dropdown from "../reusableComponents/dropdown/Dropdown";
import { fetchDataMethod, PostType } from "../../types/types";
import SvgWrapper from "../reusableComponents/svg/SvgWrapper";
import { enableEditMode } from "../../store/slices/postSlice";
import Button from "../reusableComponents/button/Button";
import { useAppDispatch } from "../../store/rootReducer";
import PopUp from "../reusableComponents/popup/PopUp";
import Clap from "../../assets/images/MediumClap.svg";
import { useAuth } from "../../server/hooks/useAuth";
import { deleteDoc, doc } from "firebase/firestore";
import { storeRef } from "../../server/firebase";
import classes from "./PostView.module.css";
import { fetchData } from "../../server/server";

const PostView = ({
  post,
}: {
  post?: PostType;
  fetchData: fetchDataMethod;
}) => {
  const { userLoggedIn } = useAuth();
  const { postId } = useParams();
  const { state } = useLocation();
  post = state?.post;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [postContent, setPostContent] = useState<PostType>({
    id: postId!,
    title: post?.title ?? "",
    content: post?.content,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  //#region main/root post fetch using id
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await fetchData(postId!);
        if (post) {
          setPostContent((prev) => ({
            ...prev,
            title: post.title,
            content: post.content,
          }));
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    if (!post?.title) {
      fetchPost();
    }
  }, [fetchData, post?.title, postId]);
  //#endregion

  const deleteDocument = async (documentId: string) => {
    try {
      const documentRef = doc(storeRef, documentId);
      await deleteDoc(documentRef);
      toast("Story has been deleted!");
    } catch (error) {
      toast("Error deleting the Story!");
      console.error("Error deleting document: ", error);
    }
  };

  const onEditHandler = () => {
    const content = document.querySelector(".content");
    navigate("edit", {
      state: {
        post: { title: post?.title, content: content?.innerHTML },
      },
    });
    dispatch(enableEditMode());
  };

  const onDeleteHandler = async () => {
    setShowDeleteModal(true);
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
          {/* {!author?.photoURL && ( */}
          <div className={classes.avatarPlaceholder}></div>
          {/* )} */}
          {/* {author?.photoURL && ( // It should be from the post author not currentUser (earlier used currentUser, now replaced with author, some dummy name, not implemented yet), it was just for testing!!
            <img
              alt=""
              className="s co cj ck cl cp"
              src={author?.photoURL}
              loading="lazy"
            />
          )} */}
        </div>
        <div>
          <div className="authorName">Mohammed Adil Sharif</div>
          <div className="createdDate">Jun 6, 2024</div>
        </div>
      </div>
      <div className={classes.postInteractions}>
        <SvgWrapper SvgComponent={Clap} width="24px" />
        <Dropdown buttonStyles={classes.buttonStyles}>
          <SvgWrapper SvgComponent={ThreeDots} width="24px" />
          <div className="dropdownItems">
            {userLoggedIn && (
              <div
                className="dropdownItem"
                onClick={onEditHandler}
                tabIndex={0}
              >
                Edit
              </div>
            )}
            {userLoggedIn && (
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
      <HtmlContentDisplay post={postContent} fetchData={fetchData} />
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
            deleted. If you do not want to delete, you can
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
              onClick={async () => {
                await deleteDocument(postId!);
                navigate("/");
              }}
            />
          </footer>
        </div>
      </PopUp>
    </>
  );
};

export default PostView;
