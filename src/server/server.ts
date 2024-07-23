import { addDoc, doc, updateDoc } from "firebase/firestore";
import { Post } from "../types/types";
import { storeRef } from "./firebase";

export const fetchPost = async (
  url: string | null
): Promise<Post | undefined> => {
  if (!url) {
    return;
  }
  const urlSegments = url.split("/");
  const postId = urlSegments.slice(-1)[0];
  const projectId = "test-fc454";
  const collectionId = "posts";
  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionId}/${postId}`
  );
  const data = await response.json();
  return {
    id: postId,
    title: data.fields.title.stringValue,
    content: data.fields.content.stringValue,
  };
};

export const addPost = async (document: unknown) => {
  try {
    const res = await addDoc(storeRef, document);
    return res;
  } catch (error) {
    console.error("Error writing document: ", error);
  }
};

export const updatePost = async (
  documentId: string,
  updatedData: { title: string; content: string; featuredImage?: string }
): Promise<unknown> => {
  try {
    const documentRef = doc(storeRef, documentId);
    const res = await updateDoc(documentRef, updatedData);
    return res;
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};

export const clapPost = async (postId: string, userId: string, post: Partial<Post>) => {
  try {
    const documentRef = doc(storeRef, postId);
    const res = await updateDoc(documentRef, post);
    return res;
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};
