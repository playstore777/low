import { useEffect, useState } from "react";
import ContextMenu, {
  MenuItems,
  Position,
} from "../../components/header/contextMenu/ContextMenu";
import { Post } from "../../types/types";
import { fetchPost } from "../../server/server";

type ContextMenuOptions = {
  url: string;
  author?: string;
  createdDate?: string;
  updatedDate?: string;
};

const appendContent = async (
  element: HTMLElement,
  handleRightClick: (event: MouseEvent, options?: ContextMenuOptions[]) => void
) => {
  const url = element.getAttribute("data-post-url");
  if (url) {
    const res = await fetchPost(url);

    const titleElement = element.querySelector(
      ".CollapsibleLink__title > p"
    ) as HTMLDivElement;
    const contentElement = element.querySelector(
      ".CollapsibleLink__content > p"
    ) as HTMLDivElement;

    const title = res?.title;
    titleElement.innerHTML = `<h3>${title}</h3>`; // .CollapsibleLink__title > p (child of .Collapisble__title class)

    const content = res?.content;
    contentElement.innerHTML = `<p>${content}</p>`; // .CollapsibleLink__content > p (child of .Collapisble__content class)

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
  const [contextMenu, setContextMenu] = useState<null | {
    position: Position;
    menuItems: MenuItems[];
  }>(null);

  const handleRightClick = (
    event: MouseEvent,
    options?: ContextMenuOptions[]
  ) => {
    // document.addEventListener("click", () => setContextMenu(null)); // really cool option, but what if this gets overriden by some other feature? then there will be no other way to close the menu!
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      position: {
        x: event.pageX,
        y: event.pageY,
      },
      menuItems: [
        {
          label: options?.[0]?.url || "Item 1",
          onClick: () => (window.location.href = options?.[0]?.url || "#"),
        },
        { label: "Item 2", onClick: () => alert("Item 2 clicked") },
        {
          label: "Close",
          styles: { backgroundColor: "red", color: "white" },
          onClick: () => setContextMenu(null),
        },
      ],
    });
  };

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
        await appendContent(element as HTMLElement, handleRightClick);

        const nestedElements = element!.querySelectorAll("[data-post-url]");
        nestedElements.forEach((nestedElement) => queue.push(nestedElement));
      }
    };

    if (postContent.content) {
      processElements();
    }
  }, [fetchPost, postContent.content]);
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
