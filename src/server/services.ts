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

import { commentStoreRef, postStoreRef, userStoreRef } from "./firebase";
import { Comment, Post, User } from "../types/types";

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
    console.log({
      articlesList,
      lastArticle: querySnapshot.docs[querySnapshot.docs.length - 1],
    });
    return {
      articlesList,
      lastArticle: querySnapshot.docs[querySnapshot.docs.length - 1],
    };
  } catch (e) {
    console.error("error in fetching all the posts: ", e);
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

export const addPost = async (postDoc: unknown) => {
  try {
    const res = await addDoc(postStoreRef, postDoc);
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
    const res = await updateDoc(documentRef, updatedData);
    return res;
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

export const deletePost = async (documentId: string): Promise<void> => {
  try {
    const documentRef = doc(postStoreRef, documentId);
    await deleteDoc(documentRef);
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};

export const clapPost = async (postId: string, post: Partial<Post>) => {
  try {
    const documentRef = doc(postStoreRef, postId);
    const res = await updateDoc(documentRef, post);
    return res;
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

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

export const fetchCommentsAndReplies = async (
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
          ...(options?.queries ?? [])
          // orderBy("timestamp", "asc")
        )
      : query(
          commentStoreRef,
          where("postId", "==", postId),
          where("parentId", "==", ""),
          ...(options?.queries ?? [])
        );
    // console.log(commentsQuery);
    const querySnapshot = await getDocs(commentsQuery);
    // console.log(querySnapshot);
    const comments = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Comment)
    );
    // console.log(comments);
    return comments;
  } catch (error) {
    console.error("Error getting document: ", error);
    throw error;
  }
};

export const fetchPaginatedCommentsAndReplies = async (
  postId: string | null,
  parentId?: string | null,
  options?: { queries: QueryConstraint[] }
) => {
  try {
    // Fetch all comments for the specific postId
    console.log(options);
    const commentsQuery = parentId
      ? query(
          commentStoreRef,
          where("postId", "==", postId),
          where("parentId", "==", parentId ?? null),
          ...(options?.queries ?? [])
          // orderBy("timestamp", "asc")
        )
      : query(
          commentStoreRef,
          where("postId", "==", postId),
          where("parentId", "==", ""),
          ...(options?.queries ?? [])
        );
    // console.log(commentsQuery);
    const querySnapshot = await getDocs(commentsQuery);
    // console.log(querySnapshot);
    const comments = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Comment)
    );
    console.log({
      comments,
      lastComment: querySnapshot.docs[querySnapshot.docs.length - 1],
    });
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
    return res;
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
