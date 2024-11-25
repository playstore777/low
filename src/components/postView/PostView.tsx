/**
 * @param {Props} props - The properties for rendering the post.
 * @param {Post} [props.post] - The post data.
 */
import { FunctionComponent, SVGProps, useEffect, useState } from "react";

import { useLocation, useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import CommentsSection from "./comments/commentsSection/CommentsSection";
import CommentIcon from "../reusableComponents/commentIcon/commentIcon";
import SvgWrapper from "../reusableComponents/svgWrapper/SvgWrapper";
import HtmlContentDisplay from "../../packages/HtmlContentDisplay/HtmlContentDisplay";
import ShareStory from "../../assets/images/MediumShareStory.svg";
import ThreeDots from "../../assets/images/MediumThreeDots.svg";
import Dropdown from "../reusableComponents/dropdown/Dropdown";
import ClapIcon from "../reusableComponents/clapIcon/ClapIcon";
import { enableEditMode } from "../../store/slices/postSlice";
import Button from "../reusableComponents/button/Button";
import { useAppDispatch } from "../../store/rootReducer";
import Avatar from "../reusableComponents/avatar/Avatar";
import LinkedIn from "../../assets/images/linkedin.svg";
import PopUp from "../reusableComponents/popup/PopUp";
import { useAuth } from "../../server/hooks/useAuth";
import { Post, User } from "../../types/types";
import classes from "./PostView.module.css";
import X from "../../assets/images/x.svg";
import {
  clapPost,
  deletePost,
  fetchPost,
  updateUserDetails,
  getUserById,
} from "../../server/services";
import {
  generateShareableLink,
  handleCopyLink,
  removeHTMLElements,
} from "../../utils/utils";

interface props {
  post?: Post;
}

const PostView: React.FC<props> = ({ post }) => {
  const { userLoggedIn, currentUser } = useAuth();
  const { postId } = useParams();
  const { state } = useLocation();
  post = state?.post;
  // const isDraft = state?.isDraft;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [postContent, setPostContent] = useState<Post>({
    id: postId!,
    title: post?.title ?? "",
    content: post?.content ?? "",
    claps: post?.claps ?? 0,
    userId: post?.userId ?? "",
    createdAt: post?.createdAt,
    comments: post?.comments ?? [],
    tags: post?.tags ?? [],
  });
  const [contentAuthor, setContentAuthor] = useState({
    name: "",
    username: "",
    photoURL: "",
    id: "",
  });
  const [isFollowing, setIsFollowing] = useState(
    currentUser?.following?.includes(contentAuthor.id)
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAuthorUser, setIsAuthorUser] = useState(
    currentUser?.uid === contentAuthor.id
  );
  const [isClapped, setIsClapped] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const shareableLink = generateShareableLink(postId!);

  //#region main/root post fetch using id
  useEffect(() => {
    const getPost = async () => {
      try {
        const post =
          // isDraft
          //   ? await fetchDraft(postId!)
          //   :
          await fetchPost(postId!);
        if (post) {
          if (post.userId) {
            const authorDetails = await getUserById(post.userId);
            setContentAuthor({
              id: authorDetails?.uid as string,
              name: authorDetails?.displayName as string,
              username: authorDetails?.username as string,
              photoURL: authorDetails?.photoURL as string,
            });
            setIsFollowing(
              currentUser?.following?.includes(authorDetails?.uid as string)
            );
          }
          setPostContent((prev) => ({
            ...prev,
            title: post.title,
            content: post.content,
            claps: post.claps,
            clappers: post.clappers,
            userId: post.userId,
            createdAt: post.createdAt,
            tags: post.tags,
          }));
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    getPost();
  }, [currentUser, postId]);
  //#endregion

  useEffect(() => {
    let timer = undefined;
    if (isClapped && currentUser && !timer) {
      timer = setTimeout(async () => {
        const body = {
          claps: postContent.claps,
          clappers: postContent.clappers,
        };
        try {
          await clapPost(postContent.id, body);
        } catch (error) {
          toast("Something went wrong, clap was not count!");
        }
        setIsClapped(false);
      }, 3000);
    }

    return () => {
      clearTimeout(timer);

      /**
       * If this clean up function gets triggered before timeout, then API will not be called and that will cause the data to be unsynchronised or in simple Backend data will not get updated.
       *
       * So we are calling the API if timeout is cleared and also clapped, if new claps data is available to be updated in the backend.
       */
      if (isClapped) {
        const body = {
          claps: postContent.claps,
          clappers: postContent.clappers,
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
    const editableContent = removeHTMLElements(
      content as HTMLElement,
      ".unsplash-caption" // selector(classname)!
    );
    dispatch(enableEditMode());
    navigate("edit", {
      state: {
        post: {
          ...postContent,
          content: editableContent?.innerHTML,
        },
        // isDraft,
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

  const onCommentHandler = () => {
    setCommentsOpen((prev) => !prev);
  };

  const onDeletePostHandler = async () => {
    try {
      await deletePost(postId!);
      toast("Story has been deleted!");
      navigate(-1); // go one step behind!
    } catch (e) {
      toast("Error deleting the Story!");
    }
  };

  const onFollowHandler = async () => {
    const userFollowing = [...(currentUser?.following ?? [])];

    if (userFollowing.includes(contentAuthor.id)) return;

    userFollowing.push(contentAuthor.id);
    const updatedUser = { ...currentUser, following: userFollowing };
    await updateUserDetails(currentUser?.uid as string, updatedUser as User);
    setIsFollowing(true);
  };

  const onFollowingHandler = async () => {
    const userFollowing = currentUser?.following?.filter(
      (uid) => uid !== contentAuthor.id
    );
    const updatedUser = { ...currentUser, following: userFollowing };
    await updateUserDetails(currentUser?.uid as string, updatedUser as User);
    setIsFollowing(false);
  };

  const copyLink = () => handleCopyLink(shareableLink);

  return (
    <article className={classes.postWrapper}>
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
        <Avatar width="42px" height="42px" imgSrc={contentAuthor?.photoURL} />
        <div>
          <span className={classes.authorName}>
            <Link to={`/@${contentAuthor.username}`}>{contentAuthor.name}</Link>
          </span>
          {userLoggedIn && currentUser?.uid !== contentAuthor.id && (
            <span style={{ color: "var(--text-color)" }}>
              {"  "}·{"  "}
            </span>
          )}
          {userLoggedIn && currentUser?.uid !== contentAuthor.id && (
            <Button
              type="text"
              inlineButton={true}
              style={{ paddingLeft: 0 }}
              label={isFollowing ? "Following" : "Follow"}
              onClick={isFollowing ? onFollowingHandler : onFollowHandler}
            />
          )}
          <div className="createdDate">
            {postContent.createdAt &&
              postContent.createdAt?.toDate &&
              postContent.createdAt?.toDate()?.toDateString()}
          </div>
        </div>
      </div>
      <div className={classes.postInteractions}>
        <div className={classes.leftInteractions}>
          <ClapIcon
            label={postContent.claps ?? 0}
            disabled={isAuthorUser || !userLoggedIn}
            onClick={onClapHandler}
          />
          <CommentIcon onClick={onCommentHandler} />
        </div>

        <div className={classes.rightInteractions}>
          {postId && (
            <Dropdown buttonStyles={classes.buttonStyles}>
              <SvgWrapper
                SvgComponent={
                  ShareStory as unknown as FunctionComponent<SVGProps<string>>
                }
                width="24px"
              />
              <div className="dropdownItems">
                <div className="dropdownItem" tabIndex={0} onClick={copyLink}>
                  Copy Link
                </div>
                <a
                  className="dropdownItem"
                  tabIndex={0}
                  href={`https://x.com/intent/tweet?url=${encodeURIComponent(
                    shareableLink
                  )}&text=Check out this article!`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share on{" "}
                  <SvgWrapper
                    width="25"
                    height="25"
                    SvgComponent={
                      X as unknown as FunctionComponent<SVGProps<string>>
                    }
                  />
                </a>
                <a
                  className="dropdownItem"
                  tabIndex={0}
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    shareableLink
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share on{" "}
                  <SvgWrapper
                    width="25"
                    height="25"
                    SvgComponent={
                      LinkedIn as unknown as FunctionComponent<SVGProps<string>>
                    }
                  />
                </a>
                <a
                  className="dropdownItem"
                  tabIndex={0}
                  href={`mailto:?subject=Check out this article&body=${shareableLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share via Email
                </a>
              </div>
            </Dropdown>
          )}

          <Dropdown buttonStyles={classes.buttonStyles}>
            <SvgWrapper
              SvgComponent={
                ThreeDots as unknown as FunctionComponent<SVGProps<string>>
              }
              width="24px"
            />
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
            </div>
          </Dropdown>
        </div>
      </div>
      {postContent?.content && <HtmlContentDisplay post={postContent} />}
      <div className={classes.tags}>
        {postContent.tags &&
          postContent.tags?.length > 0 &&
          postContent.tags?.map((tag) => (
            <div key={tag} className={classes.tag}>
              {tag}
            </div>
          ))}
      </div>
      <div className={classes.footerInteractions}>
        <ClapIcon
          label={postContent.claps ?? 0}
          disabled={isAuthorUser || !userLoggedIn}
          onClick={onClapHandler}
        />
        <CommentIcon onClick={onCommentHandler} />
      </div>
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
      <CommentsSection
        onClose={() => setCommentsOpen(false)}
        post={postContent}
        isOpen={commentsOpen}
      />
    </article>
  );
};

export default PostView;
