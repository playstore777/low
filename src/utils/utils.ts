import { MouseEvent, TouchEvent } from "react";

import { toast } from "react-toastify";

import { ContextMenuOptions, NestedAuthors } from "../types/types";
import { fetchPost, getUserById } from "../server/services";
import { createPost } from "../store/slices/postSlice";
import { AppDispatch } from "../store/configureStore";

export const createElementFromHTML = (htmlString: string): HTMLElement => {
  const div = document.createElement("div");
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div;
};

export const getSelectedWord = (
  e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
) => {
  const selectedLine = (e.target as HTMLElement).textContent;
  const selectedData = window.getSelection();
  const selectedContent = selectedLine?.slice(
    selectedData?.anchorOffset,
    selectedData?.focusOffset
  );
  return selectedContent;
};

export const normalizeCollapsibles = (element: HTMLElement | string) => {
  if (typeof element === "string") {
    const content = element;
    element = document.createElement("div");
    element.innerHTML = content;
  }
  const collapsiblesTitles = element.querySelectorAll(
    ".CollapsibleLink__title"
  );
  const collapsiblesContents = element.querySelectorAll(
    ".CollapsibleLink__content"
  );
  collapsiblesTitles.forEach((title) => {
    title.innerHTML = "<p><br/></p>";
  });
  collapsiblesContents.forEach((content) => {
    content.innerHTML = "<p><br/></p>";
  });
  return element;
};

export const removeHTMLElements = (
  htmlElement: HTMLElement,
  selector: string
) => {
  const elementsToRemove = htmlElement.querySelectorAll(`${selector}`);
  elementsToRemove.forEach((element) => {
    element && element.remove();
  });
  return htmlElement;
};

// const click = () => {
//   console.log("trigger nested content!");
// };

export const appendContent = async (
  element: HTMLElement,
  events: {
    handleRightClick: (
      event: MouseEvent<HTMLDivElement>,
      options?: ContextMenuOptions[]
    ) => void;
    handleTouchStart: (event: TouchEvent<HTMLDivElement>, url?: string) => void;
    handleTouchEnd: () => void;
  },
  setNestedAuthors: React.Dispatch<React.SetStateAction<NestedAuthors>>
) => {
  const url = element.getAttribute("data-post-url");
  // if (url) {
  //   // trying for on-demand for better performance!!
  //   const button = document.createElement("button");
  //   button.setAttribute("data-post-url", url);
  //   button.textContent = "Show story";
  //   button.onclick = click;
  //   element.replaceWith(button);
  //   console.log(button.outerHTML);
  // }
  if (url) {
    const res = await fetchPost(url);
    if (res?.userId) {
      const author = await getUserById(res?.userId as string);
      if (author) {
        setNestedAuthors((map: NestedAuthors) => {
          map.set(url, { authorName: author?.displayName ?? "" });
          return map;
        });
      }
    }

    const titleElement = element.querySelector(
      ".CollapsibleLink__title"
    ) as HTMLDivElement;
    const contentElement = element.querySelector(
      ".CollapsibleLink__content"
    ) as HTMLDivElement;

    const title = res?.title;
    titleElement.innerHTML = `<p><h3>${title}</h3></p>`; // .CollapsibleLink__title (child of .Collapisble__title class)

    const content = res?.content;
    contentElement.innerHTML = `<p>${content}</p>`; // .CollapsibleLink__content (child of .Collapisble__content class)

    contentElement.ontouchstart = (event) => {
      event.stopPropagation();
      events.handleTouchStart(
        event as unknown as TouchEvent<HTMLDivElement>,
        url
      );
    };
    contentElement.ontouchend = events.handleTouchEnd;

    contentElement.oncontextmenu = (e) =>
      events.handleRightClick(e as unknown as MouseEvent<HTMLDivElement>, [
        {
          url: url,
        },
      ]);
  }
};

export const debounceWithReduxState = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number,
  dispatch: AppDispatch,
  stateTimer?: NodeJS.Timeout
): T => {
  let timeoutId: NodeJS.Timeout | undefined = stateTimer;

  return ((...args: Parameters<T>) => {
    timeoutId && clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
    dispatch(createPost({ draftTimer: timeoutId }));
  }) as T;
};

export const generateRandomId = () => Math.random().toString(36).slice(2, 9);

export const getFirstImageFromHTML = (htmlElement: HTMLElement) =>
  htmlElement.querySelector("img");

export const generateShareableLink = (postId: string) => {
  return `${window.location.origin}/post/${postId}`;
};

export const handleCopyLink = (shareableLink: string) => {
  navigator.clipboard
    .writeText(shareableLink)
    .then(() => toast("Link copied to clipboard!"))
    .catch((err) => console.error("Failed to copy: ", err));
};

export const getPreferredColorScheme = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const isMobileDevice = () =>
  /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );

export const getWordMenuItems = (
  event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>,
  getDefinition: (value?: string) => void
) => {
  const selectedWord = getSelectedWord(event);

  const menuItems = [
    { label: `Selected word is: ${selectedWord}` },
    {
      label: "Find the definition in dictionary",
      onClick: () => getDefinition(selectedWord),
    },
  ];

  return menuItems;
};
