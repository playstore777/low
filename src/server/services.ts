import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  QueryConstraint,
  updateDoc,
  where,
} from "firebase/firestore";

import {
  commentStoreRef,
  draftStoreRef,
  postStoreRef,
  userStoreRef,
} from "./firebase";
import { ClapPostComment, Comment, Post, User } from "../types/types";

const Access_Key = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

//#region Post services
export const fetchAllPosts = async (...options: QueryConstraint[]) => {
  try {
    const postQuery = query(
      postStoreRef,
      orderBy("createdAt", "desc"),
      ...options
    );
    const querySnapshot = await getDocs(postQuery);
    const articlesList = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Post)
    );
    return {
      articlesList,
      lastArticle: querySnapshot.docs[querySnapshot.docs.length - 1],
    };
  } catch (e) {
    console.error("error in fetching all the posts: ", e);
    throw e;
  }
};

export const fetchAllDrafts = async (...options: QueryConstraint[]) => {
  try {
    const postQuery = query(
      draftStoreRef,
      orderBy("createdAt", "desc"),
      ...options
    );
    const querySnapshot = await getDocs(postQuery);
    const articlesList = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Post)
    );
    return {
      articlesList,
      lastArticle: querySnapshot.docs[querySnapshot.docs.length - 1],
    };
  } catch (e) {
    console.error("error in fetching all the drafts: ", e);
    throw e;
  }
};

export const fetchPost = async (
  url: string | null
): Promise<Post | undefined> => {
  if (!url) {
    return;
  }
  const urlSegments = url.split("/");
  const postId = urlSegments.slice(-1)[0];

  try {
    const postDocRef = doc(postStoreRef, postId);
    const postDoc = await getDoc(postDocRef);

    if (postDoc.exists()) {
      const data = postDoc.data();
      // // console.log(data);
      return {
        id: postId,
        title: data.title,
        content: data.content,
        userId: data.userId,
        claps: data.claps,
        clappers: data.clappers,
        createdAt: data.createdAt,
        tags: data?.tags,
      };
    } else {
      // console.log("No such document!");
      return undefined;
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    throw error;
  }
};

export const fetchDraft = async (
  url: string | null
): Promise<Post | undefined> => {
  if (!url) {
    return;
  }
  const urlSegments = url.split("/");
  const postId = urlSegments.slice(-1)[0];

  try {
    const postDocRef = doc(draftStoreRef, postId);
    const postDoc = await getDoc(postDocRef);

    if (postDoc.exists()) {
      const data = postDoc.data();
      // // console.log(data);
      return {
        id: postId,
        title: data.title,
        content: data.content,
        userId: data.userId,
        claps: data.claps,
        clappers: data.clappers,
        createdAt: data.createdAt,
        tags: data?.tags,
      };
    } else {
      // console.log("No such document!");
      return undefined;
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    throw error;
  }
};

export const draftPost = async (id: string, postDoc: Partial<Post>) => {
  console.log("draft id: ", id);

  // don't add new & empty draft!
  if (!id && !postDoc.title && !postDoc.content) return;

  try {
    if (id) {
      const documentRef = doc(draftStoreRef, id);
      const res = await updateDoc(documentRef, postDoc);
      console.log("res: ", res);
      return res;
    } else {
      const response = await addDoc(draftStoreRef, postDoc);
      return response;
    }
  } catch (error) {
    console.error("Error saving draft: ", error);
    throw error;
  }
};

export const deleteDraftPost = async (documentId: string) => {
  try {
    const documentRef = doc(draftStoreRef, documentId);
    await deleteDoc(documentRef);
  } catch (error) {
    console.error("Error deleting document from drafts: ", error);
    throw error;
  }
};

export const addPost = async (postDoc: Partial<Post>) => {
  try {
    const res = await addDoc(postStoreRef, postDoc);
    // if (postDoc.id) {
    //   await deleteDraftPost(postDoc.id!);
    // }
    return res;
  } catch (error) {
    console.error("Error writing document: ", error);
    throw error;
  }
};

export const updatePost = async (
  documentId: string,
  updatedData: Partial<Post>
): Promise<void> => {
  try {
    // console.log("updatePost body: ", updatedData);
    const documentRef = doc(postStoreRef, documentId);
    // if (!(await getDoc(documentRef)).exists()) {
    //   // when the post is Draft
    //   await addPost(updatedData);
    // } else {
    const res = await updateDoc(documentRef, updatedData);
    return res;
    // }
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

export const deletePost = async (documentId: string): Promise<void> => {
  try {
    // const documentRef = doc(postStoreRef, documentId);
    // const draft = await getDoc(documentRef);
    // if (!draft.exists()) {
    //   // when the post is Draft
    //   await deleteDraftPost(documentId);
    // } else {
    const documentRef = doc(postStoreRef, documentId);
    await deleteDoc(documentRef);
    // }
  } catch (error) {
    console.error("Error deleting document from posts: ", error);
    throw error;
  }
};

export const clapPost = async (postId: string, post: ClapPostComment) => {
  try {
    const documentRef = doc(postStoreRef, postId);
    const res = await updateDoc(documentRef, post);
    return res;
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};
//#endregion

//#region User services
export const getUserById = async (
  userId: string
): Promise<Partial<User> | null> => {
  try {
    const userDocRef = doc(userStoreRef, userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // console.log("user details: ", userDoc.data());
      return userDoc.data();
    } else {
      // console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    throw error;
  }
};

export const updateUserDetails = async (
  userId: string,
  updatedUserData: Partial<User>
) => {
  if (!userId) return;
  try {
    const body = {
      username: updatedUserData.username ?? "",
      photoURL: updatedUserData.photoURL ?? "",
      bio: updatedUserData.bio ?? "",
      followers: updatedUserData.followers ?? [],
      following: updatedUserData.following ?? [],
      notifications: updatedUserData.notifications ?? [],
      uid: updatedUserData.uid ?? "",
      displayName: updatedUserData.displayName ?? "",
    };
    const documentRef = doc(userStoreRef, userId);
    await updateDoc(documentRef, body);
  } catch (error) {
    console.error("Error: failed to follow user. ", error);
    throw error;
  }
};

export const getUserByUsername = async (username: string) => {
  const q = query(userStoreRef, where("username", "==", username));

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // If there's a matching document, get the first one
      const userDoc = querySnapshot.docs[0].data();
      return userDoc;
    } else {
      console.log("No user found with that username.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user by username: ", error);
  }
};
//#endregion

//#region Comment services
// export const fetchCommentsAndReplies = async (
//   postId: string | null,
//   parentId?: string | null,
//   options?: { queries: QueryConstraint[] }
// ) => {
//   try {
//     // Fetch all comments for the specific postId
//     const commentsQuery = parentId
//       ? query(
//           commentStoreRef,
//           where("postId", "==", postId),
//           where("parentId", "==", parentId ?? null),
//           ...(options?.queries ?? [])
//           // orderBy("timestamp", "asc")
//         )
//       : query(
//           commentStoreRef,
//           where("postId", "==", postId),
//           where("parentId", "==", ""),
//           ...(options?.queries ?? [])
//         );
//     // console.log(commentsQuery);
//     const querySnapshot = await getDocs(commentsQuery);
//     // console.log(querySnapshot);
//     const comments = querySnapshot.docs.map(
//       (doc) =>
//         ({
//           id: doc.id,
//           ...doc.data(),
//         } as Comment)
//     );
//     // console.log(comments);
//     return comments;
//   } catch (error) {
//     console.error("Error getting document: ", error);
//     throw error;
//   }
// };

export const fetchPaginatedCommentsAndReplies = async (
  postId: string | null,
  parentId?: string | null,
  options?: { queries: QueryConstraint[] }
) => {
  try {
    // Fetch all comments for the specific postId
    const commentsQuery = parentId
      ? query(
          commentStoreRef,
          where("postId", "==", postId),
          where("parentId", "==", parentId ?? null),
          orderBy("timestamp", "asc"),
          ...(options?.queries ?? [])
        )
      : query(
          commentStoreRef,
          where("postId", "==", postId),
          where("parentId", "==", ""),
          orderBy("timestamp", "asc"),
          ...(options?.queries ?? [])
        );
    const querySnapshot = await getDocs(commentsQuery);
    const comments = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Comment)
    );
    return {
      comments,
      lastComment: querySnapshot.docs[querySnapshot.docs.length - 1],
    };
  } catch (e) {
    console.error("error in fetching comments: ", e);
    throw e;
  }
};

export const addCommentOrReply = async (
  postId: string,
  commentOrReplyDoc: Record<string, unknown>,
  parentId = ""
) => {
  try {
    commentOrReplyDoc = { ...commentOrReplyDoc, postId, parentId };
    const res = await addDoc(commentStoreRef, commentOrReplyDoc);
    const savedCommentOrReply = await getDoc(res);
    return {
      id: savedCommentOrReply.id,
      ...savedCommentOrReply.data(),
    };
  } catch (error) {
    console.error("Error writing document: ", error);
    throw error;
  }
};

export const editComment = async (
  postId: string,
  commentDoc: Partial<Comment>
) => {
  try {
    commentDoc = { ...commentDoc, postId };
    const docRef = doc(commentStoreRef, commentDoc.id);
    const res = await updateDoc(docRef, commentDoc);
    return res;
  } catch (error) {
    console.error("Error writing document: ", error);
    throw error;
  }
};

export const deleteComment = async (commentId: string) => {
  /**
   * Only deletes the specified comment, will not touch the children, as they
   * will get orphan and should not bother much till we fetch with constraints such
   * as postId and parentId...
   * Reason: deleting every comment even the children will cost more calls!
   */
  try {
    const docRef = doc(commentStoreRef, commentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};

export const clapComment = async (commentId: string, post: ClapPostComment) => {
  try {
    const documentRef = doc(commentStoreRef, commentId);
    const res = await updateDoc(documentRef, post);
    return res;
  } catch (error) {
    console.error("Error while trying to clap the comment: ", error);
    throw error;
  }
};
//#endregion

//#region misc
export const getDefFromDict = async (word: string) => {
  if (!word.trim()) return;
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word.trim()}`
  );
  const body = await response.json();
  return body;
};

export const getPhotosFromUnsplash = async (
  query: string,
  pageNumber?: number
) => {
  // ): Promise<{ total: number; total_pages: number; results: [] }> => {
  if (!Access_Key) return;
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?page=${
        pageNumber || 1
      }&query=${query}&client_id=${Access_Key}`
    );
    const body = await response.json();
    return body;
  } catch (error) {
    console.error("Error in fetching photos from Unsplash: ", error);
    throw error;
  }
};
//#endregion
