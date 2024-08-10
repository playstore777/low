import { useCallback, useEffect, useState } from "react";

import { fetchPost, getUserById } from "../../server/services";
import ContextMenu, {
  MenuItems,
  Position,
} from "../../components/header/contextMenu/ContextMenu";
import { Post } from "../../types/types";

type ContextMenuOptions = {
  url: string;
  author?: string;
  createdDate?: string;
  updatedDate?: string;
};

type NestedAuthors = {
  [url: string]: {
    authorName: string;
  };
};

const appendContent = async (
  element: HTMLElement,
  handleRightClick: (event: MouseEvent, options?: ContextMenuOptions[]) => void,
  setNestedAuthors: (value: NestedAuthors) => void
) => {
  const url = element.getAttribute("data-post-url");
  if (url) {
    const res = await fetchPost(url);
    if (res?.userId) {
      const user = await getUserById(res?.userId as string);
      user &&
        setNestedAuthors({ [url]: { authorName: user.displayName as string } });
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

const HtmlContentDisplay = ({
  post,
  attr,
}: {
  post?: Post;
  attr?: {
    style: null | object;
    className: {
      content: null | string;
    };
  };
}) => {
  const [postContent] = useState({
    title: post?.title,
    content: post?.content,
  });
  const [nestedAuthors, setNestedAuthors] = useState<NestedAuthors>({});
  const [contextMenu, setContextMenu] = useState<null | {
    position: Position;
    menuItems: MenuItems[];
  }>(null);

  const handleRightClick = useCallback(
    (event: MouseEvent, options?: ContextMenuOptions[]) => {
      // document.addEventListener("click", () => setContextMenu(null));
      /**
       * really cool option, but what if this gets overriden by some other
       * feature? then there will be no other way to close the menu! (eg, now we
       * have Three dots menu which also gets removed on "click" of outside, so,
       * we need to use better approach in both the places).
       * */
      event.preventDefault();
      event.stopPropagation();

      const authorDetails = nestedAuthors[options?.[0]?.url as string];
      const menuItem = { label: "", onClick: () => {} };
      if (authorDetails) {
        menuItem.label = authorDetails.authorName;
      }
      setContextMenu({
        position: {
          x: event.pageX,
          y: event.pageY,
        },
        menuItems: [
          {
            label: "Post Url: " + options?.[0]?.url || "Unable to show URL",
            onClick: () => (window.location.href = options?.[0]?.url || "#"),
          },
          menuItem && {
            label: "Author: " + menuItem.label,
            onClick: menuItem.onClick,
          },
          {
            label: "Close",
            styles: { backgroundColor: "red", color: "white" },
            onClick: () => setContextMenu(null),
          },
        ],
      });
    },
    [nestedAuthors]
  );

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  // //#region main/root post fetch using id
  // useEffect(() => {
  //   const fetchPost = async () => {
  //     try {
  //       const post = await fetchData(postId!);
  //       setPostContent({ title: post.title, content: post.content });
  //     } catch (error) {
  //       console.error("Error fetching post:", error);
  //     }
  //   };

  //   if (!post?.title) {
  //     fetchPost();
  //   }
  // }, [postId]);
  // //#endregion

  //#region nested/child post fetch
  useEffect(() => {
    const processElements = async () => {
      const elements = document.querySelectorAll("[data-post-url]");
      const queue = Array.from(elements);

      while (queue.length > 0) {
        const element = queue.shift();
        await appendContent(
          element as HTMLElement,
          handleRightClick,
          setNestedAuthors
        );

        const nestedElements = element!.querySelectorAll("[data-post-url]");
        nestedElements.forEach((nestedElement) => queue.push(nestedElement));
      }
    };
    // // console.log(postContent.content);
    if (postContent.content) {
      processElements();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postContent.content]); // adding handleRightClick as deps causing infinite re-rendering!
  //#endregion

  return (
    <>
      {postContent?.content && (
        <div
          className={attr?.className?.content ?? "content"}
          style={attr?.style ?? {}}
          dangerouslySetInnerHTML={{
            __html:
              postContent.content || "<h1>Error: content not provided</h1>",
          }}
        ></div>
      )}
      {contextMenu && (
        <ContextMenu
          position={contextMenu.position}
          menuItems={contextMenu.menuItems}
          onClose={handleCloseContextMenu}
        />
      )}
    </>
  );
};

export default HtmlContentDisplay;
