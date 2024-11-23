/**
 * @param {null} props - Unused props
 */

import { useEffect, useState } from "react";

import InfiniteScroll from "react-infinite-scroller";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import {
  startAfter,
  limit,
  where,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

import LayoutWithSidebar from "../../layoutWithSidebar/LayoutWithSidebar";
import {
  selectAllPostsWithTimestamp,
  useAppDispatch,
  useAppSelector,
} from "../../store/rootReducer";
import PostPreview from "../reusableComponents/postPreview/PostPreview";
import EditUserProfile from "../authentication/EditUserProfile";
import { clearAllPosts, uploadAllPosts } from "../../store/slices/postSlice";
import Avatar from "../reusableComponents/avatar/Avatar";
import Button from "../reusableComponents/button/Button";
import PopUp from "../reusableComponents/popup/PopUp";
import { useAuth } from "../../server/hooks/useAuth";
import classes from "./userProfile.module.css";
import { User } from "../../types/types";
import {
  fetchAllDrafts,
  fetchAllPosts,
  getUserByUsername,
  updateUserDetails,
} from "../../server/services";

interface props {}

enum ActiveTabEnum {
  DRAFTS = "drafts",
  HOME = "home",
}

const UserProfile: React.FC<props> = () => {
  const allPosts = useAppSelector(selectAllPostsWithTimestamp);
  const { name } = useParams();
  const { currentUser, userLoggedIn } = useAuth();
  const dispatch = useAppDispatch();

  const [profile, setProfile] = useState<User | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<
    DocumentData,
    DocumentData
  > | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFollowing, setIsFollowing] = useState(
    profile?.uid && currentUser?.following?.includes(profile?.uid)
  );
  const [activeTab, setActiveTab] = useState(ActiveTabEnum.HOME);

  useEffect(() => {
    dispatch(clearAllPosts());
    fetchAllPostsByUser();
    return () => {
      dispatch(clearAllPosts());
    };
  }, [activeTab]);

  useEffect(() => {
    const username = name!.slice(1);
    if (username !== currentUser?.username) {
      getUser(username);
    } else {
      setProfile(currentUser);
    }
  }, [currentUser, name]);

  const getUser = async (username: string) => {
    const user = await getUserByUsername(username);
    if (user) {
      setProfile(user as User);
      setIsFollowing(currentUser?.following?.includes(user?.uid));
    }
  };

  const fetchAllPostsByUser = async () => {
    let response;
    if (activeTab === ActiveTabEnum.DRAFTS) {
      response = await fetchAllDrafts(
        where("userId", "==", profile?.uid),
        lastDoc ? startAfter(lastDoc) : limit(3)
      );
    } else {
      response = await fetchAllPosts(
        where("userId", "==", profile?.uid),
        lastDoc ? startAfter(lastDoc) : limit(3)
      );
    }

    const { articlesList, lastArticle } = response;
    // if no more posts
    if (!articlesList.length) {
      setHasMore(false);
    } else {
      setLastDoc(lastArticle);
      dispatch(uploadAllPosts(articlesList));
    }
  };

  const onClosePopupHandler = () => {
    setIsEditingUser(false);
  };

  const onFollowHandler = async () => {
    if (!profile || isFollowing) return;
    const userFollowing = [...(currentUser?.following ?? [])];
    if (userFollowing.includes(profile?.uid)) {
      return;
    }
    userFollowing.push(profile?.uid);
    const updatedUser = { ...currentUser, following: userFollowing };
    await updateUserDetails(currentUser?.uid as string, updatedUser as User);
    setIsFollowing(true);
  };

  const onFollowingHandler = async () => {
    if (!isFollowing) return;
    const userFollowing = currentUser?.following?.filter(
      (uid) => uid !== profile?.uid
    );
    const updatedUser = { ...currentUser, following: userFollowing };
    await updateUserDetails(currentUser?.uid as string, updatedUser as User);
    setIsFollowing(false);
  };

  const updateActiveTab = (tabname: ActiveTabEnum) => {
    setActiveTab(tabname);
    setLastDoc(null);
  };

  return !profile ? (
    <>$0$ No user found with this username "{name?.slice(1)}"</>
  ) : (
    <LayoutWithSidebar>
      <div className={classes.left}>
        <header>
          <h1>{profile?.displayName}</h1>
        </header>
        {/* tabs */}
        <nav className={classes.tabs}>
          <div>
            <span>
              <div
                className={`${classes.tab} ${
                  activeTab === ActiveTabEnum.HOME && classes.highlightTab
                }`}
                onClick={() => updateActiveTab(ActiveTabEnum.HOME)}
              >
                <Link to={`/@${profile.username}`}>Home</Link>
              </div>
            </span>
          </div>
          {/* DRAFT code will use later! */}
          {/* {currentUser?.username === name?.slice(1) && (
            <div>
              <span>
                <div
                  className={`${classes.tab} ${
                    activeTab === ActiveTabEnum.DRAFTS && classes.highlightTab
                  }`}
                  onClick={() => updateActiveTab(ActiveTabEnum.DRAFTS)}
                >
                  <Link to={`/@${profile.username}`}>Drafts</Link>
                </div>
              </span>
            </div>
          )} */}
        </nav>
        {/* tabs container */}
        <InfiniteScroll
          loadMore={fetchAllPostsByUser}
          hasMore={hasMore}
          loader={<div key={0}>Loading...</div>}
        >
          {allPosts?.length > 0 &&
            allPosts
              .filter((post) => post.userId === profile.uid) // sometimes redux doesn't get updated, this filter is important!
              .map((post) => (
                <PostPreview
                  key={post.id}
                  post={post}
                  isDraft={activeTab === ActiveTabEnum.DRAFTS}
                />
              ))}
        </InfiniteScroll>
      </div>
      <div className={classes.right}>
        <Avatar imgSrc={profile.photoURL} width="6rem" height="6rem" />
        <h4>{profile?.displayName}</h4>
        <div>{profile.followers?.length ?? 0} Followers</div>
        <div className={classes.bio}></div>
        {profile.uid === currentUser?.uid && (
          <Button
            type="text"
            label="Edit Profile"
            style={{
              paddingLeft: "0",
            }}
            onClick={() => {
              setIsEditingUser(true);
            }}
          />
        )}
        {userLoggedIn && profile?.uid !== currentUser?.uid && (
          <Button
            label={isFollowing ? "Following" : "Follow"}
            style={{
              border: "1px solid var(--primary-bg-color)",
              backgroundColor: isFollowing
                ? "transparent"
                : "var(--primary-bg-color)",
              color: isFollowing ? "var(--primary-bg-color)" : "white",
            }}
            onClick={isFollowing ? onFollowingHandler : onFollowHandler}
          />
        )}
        {!userLoggedIn && (
          <Button
            label="Sign In to follow"
            style={{
              border: "1px solid var(--primary-bg-color)",
              backgroundColor: isFollowing
                ? "transparent"
                : "var(--primary-bg-color)",
              color: isFollowing ? "var(--primary-bg-color)" : "white",
            }}
            onClick={() => {}}
          />
        )}
        <PopUp
          isOpen={isEditingUser}
          onClose={onClosePopupHandler}
          key={"random-text"}
        >
          <EditUserProfile
            userData={profile}
            onCancel={onClosePopupHandler}
            onSave={onClosePopupHandler}
          />
        </PopUp>
      </div>
    </LayoutWithSidebar>
  );
};

export default UserProfile;
