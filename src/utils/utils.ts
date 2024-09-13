import { fetchPost, getUserById } from "../server/services";
import { ContextMenuOptions, NestedAuthors } from "../types/types";

export const createElementFromHTML = (htmlString: string): HTMLElement => {
  const div = document.createElement("div");
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div;
};

export const getSelectedWord = (e: React.MouseEvent<HTMLDivElement>) => {
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
  classname: string
) => {
  const elementsToRemove = htmlElement.querySelectorAll(`.${classname}`);
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
  handleRightClick: (event: MouseEvent, options?: ContextMenuOptions[]) => void,
  setNestedAuthors: (value: NestedAuthors) => void
) => {
  const url = element.getAttribute("data-post-url");
  // if (url) {
  //   // trying for on-demand for better performance!!
  //   const button = document.createElement("button");
  //   button.setAttribute("data-post-url", url);
  //   button.textContent = "Show story";
  //   element.addEventListener("click", click);
  //   element.outerHTML = button.outerHTML;
  //   console.log(button.outerHTML);
  // }
  if (url) {
    const res = await fetchPost(url);
    if (res?.userId) {
      const author = await getUserById(res?.userId as string);
      if (author) {
        const map = new Map();
        map.set(url, { authorName: author?.displayName });
        setNestedAuthors(map);
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
    contentElement.oncontextmenu = (e) =>
      handleRightClick(e, [
        {
          url: url,
        },
      ]);
  }
};
