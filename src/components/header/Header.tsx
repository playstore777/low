import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";

import { createPost, disableEditMode } from "../../store/slices/postSlice";
import { useAppDispatch, useAppSelector } from "../../store/rootReducer";
import MediumWriteIcon from "../../assets/images/MediumWriteIcon.svg";
import MediumBellIcon from "../../assets/images/MediumBellIcon.svg";
import ThreeDots from "../../assets/images/MediumThreeDots.svg";
import Dropdown from "../reusableComponents/dropdown/Dropdown";
import Authentication from "../authentication/Authentication";
import SvgWrapper from "../reusableComponents/svg/SvgWrapper";
import useScrollDirection from "../hooks/useScrollDirection";
import MediumLogo from "../../assets/images/MediumLogo.svg";
import SearchIcon from "../../assets/images/SearchIcon.svg";
import { createElementFromHTML } from "../../utils/utils";
import Button from "../reusableComponents/button/Button";
import PopUp from "../reusableComponents/popup/PopUp";
import { useAuth } from "../../server/hooks/useAuth";
import { updatePost } from "../../server/server";
import ThemeToggle from "../theme/ThemeToggle";
import { doSignOut } from "../../server/auth";
import classes from "./Header.module.css";
import PublishPost from "./PublishPost";

const Header = () => {
  const { userLoggedIn, currentUser } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const post = useAppSelector((state) => state.post);
  const scrollDirection = useScrollDirection();
  const dispatch = useAppDispatch();

  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [dataAvailable, setDataAvailable] = useState(false);
  const [publishPost, setPublishPost] = useState(false);

  const goTo = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    if (post.activePost.title || post.activePost.content) {
      setDataAvailable(true);
    } else {
      setDataAvailable(false);
    }
  }, [post]);

  const handlePublish = () => {
    setPublishPost(true);
  };

  const onCloseAuth = () => {
    setShowModal(false);
  };

  const onClosePublishPost = () => {
    setPublishPost(false);
  };

  const handleUpdate = async () => {
    const div = document.createElement("div");
    div.innerHTML = post.activePost.content;
    const collapsiblesTitles = div.querySelectorAll(".CollapsibleLink__title");
    const collapsiblesContents = div.querySelectorAll(
      ".CollapsibleLink__content"
    );
    collapsiblesTitles.forEach((title) => {
      title.innerHTML = "<p><br/></p>";
    });
    collapsiblesContents.forEach((content) => {
      content.innerHTML = "<p><br/></p>";
    });
    const htmlElement = createElementFromHTML(post.activePost.content);
    const imgElement = htmlElement.querySelector("img");
    const updatedPost = div.innerHTML;
    console.log(updatedPost);
    dispatch(createPost({ content: updatedPost }));
    const paths = pathname.split("/");
    const id = paths[paths.length - 2];
    const documentId = id;
    const updatedData = {
      title: post.activePost.title,
      content: updatedPost,
      featuredImage: imgElement?.src ?? "",
    };
    console.log(updatedData);

    try {
      await updatePost(documentId, updatedData);
      toast("Story has been updated!");
    } catch (e) {
      console.error(e);
      toast("Error updating the Story!");
    }
    dispatch(disableEditMode());
    navigate(`post/${documentId}`);
  };

  return (
    <div
      className={`${classes.headerWrapper} ${
        pathname.includes("new") && classes.paddingInlineHeader
      } ${
        scrollDirection === "up" || !scrollDirection
          ? classes.showHeader
          : classes.hideHeader
      }`}
    >
      <div className={classes.left}>
        <div id={classes.logo}>
          <a href="/">
            <SvgWrapper SvgComponent={MediumLogo} fillColor="" />
          </a>{" "}
          {/** Medium logo used only for testing */}
        </div>
        {!pathname.includes("new") && (
          <div className={classes.searchBar}>
            <SvgWrapper SvgComponent={SearchIcon} />
            <input type="text" placeholder="Search" />
          </div>
        )}
      </div>
      <div className={classes.right}>
        <ThemeToggle />
        {userLoggedIn &&
          !pathname.includes("new") &&
          !pathname.includes("edit") && (
            <div
              className={classes.postButton}
              onClick={() => {
                goTo("/new");
              }}
            >
              <SvgWrapper SvgComponent={MediumWriteIcon} />
              <div className={classes.iconCaption}>Write</div>
            </div>
          )}
        {userLoggedIn &&
          (pathname.includes("new") || pathname.includes("edit")) && (
            <div className={classes.postButton}>
              <Button
                label={
                  post.activePost.isEditMode ? "Save and Publish" : "Publish"
                }
                style={{ color: "white", fontWeight: "bold" }}
                onClick={
                  post.activePost.isEditMode ? handleUpdate : handlePublish
                }
                disabledClass={!dataAvailable}
                tooltipMessage="Publishing will become available after you start writing."
                tooltipType="click"
              />
            </div>
          )}
        {userLoggedIn &&
          (pathname.includes("new") || pathname.includes("edit")) && (
            <Dropdown buttonStyles={classes.buttonStyles}>
              <SvgWrapper SvgComponent={ThreeDots} width="24px" />
              <div className="dropdownItems">
                <div
                  className="dropdownItem"
                  // onClick={onEditHandler}
                  tabIndex={0}
                >
                  Change Feature Image
                </div>
                <div className="dropdownItem" tabIndex={0}>
                  3asdfasdfq34535325532453253sdf asfasdf
                  asflasfjasldfkasfasflas;fjlasdfa sfasfdll;
                </div>
                <div className="dropdownItem" tabIndex={0}>
                  4
                </div>
              </div>
            </Dropdown>
          )}
        {userLoggedIn && (
          <div>
            <SvgWrapper SvgComponent={MediumBellIcon} />
          </div>
        )}
        {!userLoggedIn && (
          <Button
            label="Sign up"
            onClick={() => {
              setIsSignUp(true);
              setShowModal(true);
            }}
          />
        )}
        {!userLoggedIn && (
          <span
            className={classes.signInButton}
            onClick={() => {
              setIsSignUp(false);
              setShowModal(true);
            }}
          >
            Sign in
          </span>
        )}
        <Dropdown buttonStyles={classes.buttonStyles}>
          <div className={classes.avatar}>
            {!currentUser?.photoURL && (
              <div className={classes.avatarPlaceholder}></div>
            )}
            {currentUser?.photoURL && (
              <img
                alt={currentUser?.displayName as string}
                src={currentUser?.photoURL?.toString()}
                loading="lazy"
              />
            )}
          </div>
          <div className="dropdownItems">
            {userLoggedIn && (
              <div className="dropdownItem" onClick={() => {}}>
                Settings
              </div>
            )}
            {userLoggedIn && (
              <div className="dropdownItem" onClick={doSignOut}>
                Sign Out
              </div>
            )}
          </div>
        </Dropdown>
      </div>
      <PopUp isOpen={showModal} onClose={onCloseAuth}>
        <Authentication isSignUp={isSignUp} onClose={onCloseAuth} />
      </PopUp>
      <PopUp isOpen={publishPost} onClose={onClosePublishPost}>
        <PublishPost onClose={onClosePublishPost} />
      </PopUp>
    </div>
  );
};

export default Header;
