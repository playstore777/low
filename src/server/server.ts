import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import { Post, User } from "../types/types";
import { postStoreRef, userStoreRef } from "./firebase";

export const fetchAllPosts = async () => {
  try {
    const postQuery = query(postStoreRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(postQuery);
    const articlesList = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Post)
    );
    return articlesList;
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
      // console.log(data);
      return {
        id: postId,
        title: data.title,
        content: data.content,
        userId: data.userId,
        claps: data.claps,
        clappers: data.clappers,
        createdAt: data.createdAt,
      };
    } else {
      console.log("No such document!");
      return undefined;
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    throw error;
  }
};

export const addPost = async (document: unknown) => {
  try {
    const res = await addDoc(postStoreRef, document);
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
    console.log("updatePost body: ", updatedData);
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
      console.log("user details: ", userDoc.data());
      return userDoc.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    throw error;
  }
};
