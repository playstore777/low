import { PostType } from "../types/types";

export const fetchData = async (
  url: string | null
): Promise<PostType | undefined> => {
  if (!url) {
    return;
  }
  const urlSegments = url.split("/");
  const postId = urlSegments[urlSegments.length - 1];
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
