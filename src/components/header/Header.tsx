import {
  ChangeEvent,
  FunctionComponent,
  SVGProps,
  useEffect,
  useState,
} from "react";

import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";

import { createPost, disableEditMode } from "../../store/slices/postSlice";
import { useAppDispatch, useAppSelector } from "../../store/rootReducer";
import MediumWriteIcon from "../../assets/images/MediumWriteIcon.svg";
import TextButton from "../reusableComponents/textButton/TextButton";
import SvgWrapper from "../reusableComponents/svgWrapper/SvgWrapper";
import MediumBellIcon from "../../assets/images/MediumBellIcon.svg";
import ThreeDots from "../../assets/images/MediumThreeDots.svg";
import Dropdown from "../reusableComponents/dropdown/Dropdown";
import Authentication from "../authentication/Authentication";
import useScrollDirection from "../hooks/useScrollDirection";
import MediumLogo from "../../assets/images/MediumLogo.svg";
import SearchIcon from "../../assets/images/SearchIcon.svg";
import {
  createElementFromHTML,
  normalizeCollapsibles,
} from "../../utils/utils";
import Button from "../reusableComponents/button/Button";
import Avatar from "../reusableComponents/avatar/Avatar";
import PopUp from "../reusableComponents/popup/PopUp";
import { useAuth } from "../../server/hooks/useAuth";
import PublishPost from "./publishPost/PublishPost";
import SearchPopUp from "./searchPopUp/SearchPopUp";
import useScreenSize from "../hooks/useScreenSize";
import { updatePost } from "../../server/services";
import ThemeToggle from "../theme/ThemeToggle";
import { doSignOut } from "../../server/auth";
import classes from "./Header.module.css";
import { Post } from "../../types/types";

const Header = () => {
  const { userLoggedIn, currentUser } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const state = useAppSelector((state) => state.post);
  const scrollDirection = useScrollDirection();
  const dispatch = useAppDispatch();
  const { isMobile } = useScreenSize();

  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [dataAvailable, setDataAvailable] = useState(false);
  const [publishPost, setPublishPost] = useState(false);
  const [filteredPost, setFilteredPost] = useState<Post[]>([]);

  const goTo = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    if (state.activePost.title || state.activePost.content) {
      setDataAvailable(true);
    } else {
      setDataAvailable(false);
    }
  }, [state]);

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
    const div = normalizeCollapsibles(state.activePost.content);
    const htmlElement = createElementFromHTML(state.activePost.content);
    const imgElement = htmlElement.querySelector("img");
    const updatedPost = div.innerHTML;
    dispatch(createPost({ content: updatedPost }));
    const paths = pathname.split("/");
    const id = paths[paths.length - 2];
    const documentId = id;
    const updatedData = {
      title: state.activePost.title,
      content: updatedPost,
      featuredImage: imgElement?.src ?? "",
    };

    try {
      await updatePost(documentId, updatedData);
      toast("Story has been updated!");
    } catch (e) {
      console.error(e);
      toast("Error updating the Story!");
    } finally {
      dispatch(disableEditMode());
      window.location.href = `http://localhost:5173/post/${documentId}`; // work around for navigate(`post/${documentId}`);
    }
    // navigate(`post/${documentId}`); // Not working!
  };

  const onSearchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const matches = state.allPosts.filter((post) =>
      post.title.toLowerCase().includes(value.trim().toLowerCase())
    );
    matches.length > 0 && value.trim()
      ? setFilteredPost(matches)
      : setFilteredPost([]);
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
            <SvgWrapper
              SvgComponent={
                MediumLogo as unknown as FunctionComponent<SVGProps<string>>
              }
            />
          </a>{" "}
          {/** Medium logo used only for testing */}
        </div>
        {!pathname.includes("new") && !isMobile && (
          <SearchPopUp searchWidth="200px">
            <div className={classes.searchBar}>
              <SvgWrapper
                SvgComponent={
                  SearchIcon as unknown as FunctionComponent<SVGProps<string>>
                }
                width="24px"
                height="24px"
              />
              <input
                type="text"
                placeholder="Search"
                onChange={onSearchHandler}
              />
            </div>
            <div>
              {filteredPost.map((match: Post) => (
                <div
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate(`post/${match.id}`, {
                      state: {
                        post: { title: match.title, content: match.content },
                      },
                    });
                  }}
                >
                  {match.title}
                </div>
              ))}
            </div>
          </SearchPopUp>
        )}
      </div>
      <div className={classes.right}>
        <ThemeToggle />
        {userLoggedIn &&
          !pathname.includes("new") &&
          !pathname.includes("edit") &&
          !isMobile && (
            <div
              className={classes.postButton}
              onClick={() => {
                goTo("/new");
              }}
            >
              <SvgWrapper
                SvgComponent={
                  MediumWriteIcon as unknown as FunctionComponent<
                    SVGProps<string>
                  >
                }
              />
              <div className={classes.iconCaption}>Write</div>
            </div>
          )}
        {userLoggedIn &&
          (pathname.includes("new") || pathname.includes("edit")) && (
            <div className={classes.postButton}>
              <Button
                label={
                  state.activePost.isEditMode ? "Save and Publish" : "Publish"
                }
                style={{ color: "white", fontWeight: "bold" }}
                onClick={
                  state.activePost.isEditMode ? handleUpdate : handlePublish
                }
                disabledWithMessage={!dataAvailable}
                tooltipMessage="Publishing will become available after you start writing."
                tooltipType="click"
              />
            </div>
          )}
        {userLoggedIn &&
          (pathname.includes("new") || pathname.includes("edit")) && (
            <Dropdown buttonStyles={classes.buttonStyles}>
              <SvgWrapper
                SvgComponent={
                  ThreeDots as unknown as FunctionComponent<SVGProps<string>>
                }
                width="24px"
              />
              <div className="dropdownItems">
                <div
                  className="dropdownItem"
                  // onClick={onEditHandler}
                  tabIndex={0}
                >
                  Change Feature Image
                </div>
                <div className="dropdownItem" tabIndex={0}>
                  4
                </div>
              </div>
            </Dropdown>
          )}
        {userLoggedIn && (
          <div>
            <SvgWrapper
              SvgComponent={
                MediumBellIcon as unknown as FunctionComponent<SVGProps<string>>
              }
            />
          </div>
        )}
        {!userLoggedIn && !isMobile && (
          <Button
            label="Sign up"
            onClick={() => {
              setIsSignUp(true);
              setShowModal(true);
            }}
          />
        )}
        {!userLoggedIn && !isMobile && (
          <TextButton
            label="Sign in"
            onClick={() => {
              setIsSignUp(false);
              setShowModal(true);
            }}
          />
        )}
        <Dropdown buttonStyles={classes.buttonStyles}>
          <Avatar
            imgSrc={currentUser?.photoURL?.toString()}
            imgTitle={currentUser?.displayName?.toString()}
          />
          <div className="dropdownItems">
            {userLoggedIn &&
              !pathname.includes("new") &&
              !pathname.includes("edit") &&
              isMobile && (
                <div
                  className={`${classes.postButton} dropdownItem`}
                  onClick={() => {
                    goTo("/new");
                  }}
                >
                  <SvgWrapper
                    SvgComponent={
                      MediumWriteIcon as unknown as FunctionComponent<
                        SVGProps<string>
                      >
                    }
                  />
                  <div className={classes.iconCaption}>Write</div>
                </div>
              )}
            {userLoggedIn && (
              <div
                className="dropdownItem"
                onClick={() => {
                  navigate(`/@${currentUser?.username}`);
                }}
              >
                Profile
              </div>
            )}
            {userLoggedIn && (
              <div className="dropdownItem" onClick={() => {}}>
                Settings
              </div>
            )}
            {/* <FontType /> */} {/* has bug with Header, can't use */}
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
