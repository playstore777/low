/**
 * Copyright (c) 2024 Mohammed Adil Sharif.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";

import { LexicalEditor } from "lexical";

import { Post } from "../../types";
import Button from "../ui/Button";
import { DialogActions } from "../ui/Dialog";
import TextInput from "../ui/TextInput";
import { INSERT_COLLAPSIBLE_COMMAND } from ".";

//#region getPost should get from Props as callback
const getPost = async (url: string) => {
  const urlSegments = url.split("/");
  const postId = urlSegments[urlSegments.length - 1];
  const projectId = "test-fc454";
  const collectionId = "posts";
  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionId}/${postId}`
  );
  const json = await res.json();
  return {
    title: json.fields.title.stringValue,
    content: json.fields.content.stringValue,
  };
};
//#endregion

const processElements = async (container: HTMLElement) => {
  const elements = container.querySelectorAll("[data-post-url]");
  const queue = Array.from(elements);

  while (queue.length > 0) {
    const element = queue.shift();
    await appendContent(element as HTMLElement);

    const nestedElements = element!.querySelectorAll("[data-post-url]");
    nestedElements.forEach((nestedElement) => queue.push(nestedElement));
  }
};

const appendContent = async (element: HTMLElement) => {
  const url = element.getAttribute("data-post-url");
  if (url) {
    const res = await getPost(url);
    console.log(res);

    const title = res.title;
    (
      element.querySelector(".CollapsibleLink__title > p") as HTMLDivElement
    ).innerHTML = `<h3>${title}</h3>`; // .CollapsibleLink__title > p (child of .Collapisble__title class)

    const content = res.content;
    (
      element.querySelector(".CollapsibleLink__content > p") as HTMLDivElement
    ).innerHTML = `<p>${content}</p>`; // .CollapsibleLink__content > p (child of .Collapisble__content class)
  }
};

export function InsertCollapsibleLinkUriDialogBody({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  const [url, setUrl] = useState("");

  const isDisabled = url === "";

  const onClick = async (payload: { url: string; post?: Post }) => {
    const res = await getPost(payload.url);

    const contentString = res.content;
    // Create a temporary container to hold the content string as HTML
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = contentString;

    // Process elements within the temporary container
    await processElements(tempContainer);

    const processedContent = tempContainer.innerHTML;
    const post = {
      title: res.title,
      content: processedContent,
    };
    payload = {
      ...post,
      url: payload.url,
    };
    activeEditor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, payload);
    onClose();
  };

  return (
    <>
      <TextInput
        label="Post URL"
        placeholder="i.e. https://source.unsplash.com/random"
        onChange={setUrl}
        value={url}
        data-test-id="post-modal-url-input"
      />
      <DialogActions>
        <Button
          data-test-id="post-modal-confirm-btn"
          disabled={isDisabled}
          onClick={() => onClick({ url })}
        >
          Confirm
        </Button>
      </DialogActions>
    </>
  );
}
