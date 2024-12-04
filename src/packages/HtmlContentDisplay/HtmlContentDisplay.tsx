import { useEffect, useRef, useState, MouseEvent, TouchEvent } from "react";

import { ContextMenuOptions, NestedAuthors, Post } from "../../types/types";
import AsideSection from "../../components/reusableComponents/asideSection/AsideSection";
import Portal from "../../components/reusableComponents/portal/Portal";
import {
  appendContent,
  getWordMenuItems,
  isMobileDevice,
} from "../../utils/utils";
import ContextMenu, {
  MenuItem,
  Position,
} from "../../components/header/contextMenu/ContextMenu";
import { getDefFromDict } from "../../server/services";
import "./HtmlContentDisplay.css";

type Definition = {
  partOfSpeech: string;
  definitions: {
    definition: string;
    synonyms: [];
    antonyms: [];
    example: string;
  }[];
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
  const [nestedAuthors, setNestedAuthors] = useState<NestedAuthors>(
    new Map<string, { authorName: string }>()
  );
  const [contextMenu, setContextMenu] = useState<null | {
    position: Position;
    menuItems: MenuItem[];
  }>(null);
  const [showAsideSection, setShowAsideSection] = useState(false);
  const [definitions, setDefinitions] = useState<Definition[] | null>(null);

  const isLongPressRef = useRef(false);
  const longPressTimerRef = useRef<number | null>(null);

  const handleRightClick = (
    event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>,
    options?: ContextMenuOptions[] // in future we can add as many options as we want!
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const url = options?.[0]?.url as string;
    const menuItem = { label: "", onClick: () => {} };

    if (nestedAuthors.has(url)) {
      const authorDetails = nestedAuthors.get(url);
      if (authorDetails) {
        menuItem.label = authorDetails.authorName;
      }
    }

    const menuItems = [
      {
        label:
          "Post Url: " + options?.[0]?.url ||
          "Sorry, something's wrong with URL",
        onClick: () => (window.location.href = options?.[0]?.url || "#"),
      },
      menuItem && {
        label: "Author: " + menuItem.label,
        onClick: menuItem.onClick,
      },
    ];

    setContext(event, menuItems);
    // const { clientX } = "clientX" in event ? event : event.touches[0];
    // const { clientY } = "clientY" in event ? event : event.touches[0];

    // setContextMenu({
    //   position: {
    //     x: clientX,
    //     y: clientY,
    //   },
    //   menuItems: [
    //     {
    //       label:
    //         "Post Url: " + options?.[0]?.url ||
    //         "Sorry, something's wrong with URL",
    //       onClick: () => (window.location.href = options?.[0]?.url || "#"),
    //     },
    //     menuItem && {
    //       label: "Author: " + menuItem.label,
    //       onClick: menuItem.onClick,
    //     },
    //   ],
    // });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const getDefinition = async (selectedWord?: string) => {
    const dictionaryRes = await getDefFromDict(selectedWord ?? "");
    setShowAsideSection(true);
    const defs: Definition[] = [];
    dictionaryRes.length &&
      dictionaryRes?.forEach((res: { meanings: Definition[] }) => {
        res.meanings?.forEach((meaning: Definition) => {
          const means = {
            partOfSpeech: meaning.partOfSpeech,
            definitions: meaning.definitions,
          };
          defs.push(means);
        });
      });
    dictionaryRes.length && setDefinitions(defs);
  };

  const setContext = (
    event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>,
    menuItems: MenuItem[]
  ) => {
    const { clientX } = "clientX" in event ? event : event.touches[0];
    const { clientY } = "clientY" in event ? event : event.touches[0];

    setContextMenu({
      position: { x: isMobileDevice() ? 0 : clientX, y: clientY },
      menuItems,
    });
  };

  const handleDoubleClick = async (event: MouseEvent<HTMLDivElement>) => {
    if (isLongPressRef.current || isMobileDevice()) return; // Ignore double-click if it's a long-press
    const menuItems = getWordMenuItems(event, getDefinition);
    setContext(event, menuItems);
  };

  const closeDefinitionSection = () => {
    setShowAsideSection(false);
    setDefinitions(null);
  };

  const handleTouchStart = (
    event: TouchEvent<HTMLDivElement>,
    url?: string
  ) => {
    isLongPressRef.current = false;

    longPressTimerRef.current = window.setTimeout(() => {
      isLongPressRef.current = true;
      let menuItems = getWordMenuItems(event, getDefinition);
      if (url) {
        const menuItem = { label: "", onClick: () => {} };

        if (nestedAuthors.has(url)) {
          const authorDetails = nestedAuthors.get(url);
          if (authorDetails) {
            menuItem.label = authorDetails.authorName;
          }
        }

        menuItems = menuItems.concat([
          {
            label: "Post Url: " + url || "Sorry, something's wrong with URL",
            onClick: () => (window.location.href = url || "#"),
          },
          menuItem && {
            label: "Author: " + menuItem.label,
            onClick: menuItem.onClick,
          },
        ]);
      }
      setContext(event, menuItems);
    }, 500); // 500ms of wait!
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
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
          {
            handleRightClick,
            handleTouchStart,
            handleTouchEnd,
          },
          setNestedAuthors
        );

        const nestedElements = element!.querySelectorAll("[data-post-url]");
        nestedElements.forEach((nestedElement) => queue.push(nestedElement));
      }
    };

    const processImages = () => {
      const imagesWithCaptions = document.querySelectorAll("img[data-caption]");

      imagesWithCaptions.forEach((img) => {
        const captionHtml = img.getAttribute("data-caption");

        const captionDiv = document.createElement("div");
        // captionDiv.className = "caption";
        captionDiv.style.marginBlock = "1rem";
        captionDiv.style.fontSize = "14px";
        captionDiv.style.color = "var(--text-color)";
        captionDiv.style.textAlign = "center";

        captionDiv.innerHTML = captionHtml ?? "error with caption";

        // Insert the caption <div> right after the <img> element
        img.insertAdjacentElement("afterend", captionDiv);
      });
    };
    // // console.log(postContent.content);
    if (postContent.content) {
      processElements();
      processImages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postContent.content]); // adding handleRightClick as deps causing infinite re-rendering!
  //#endregion

  return (
    <>
      {postContent?.content && (
        <div
          className={`${attr?.className?.content ?? ""} content`}
          style={attr?.style ?? {}}
          dangerouslySetInnerHTML={{
            __html:
              postContent.content || "<h1>Error: content not provided</h1>",
          }}
          onDoubleClick={handleDoubleClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        ></div>
      )}
      {contextMenu && (
        <Portal>
          <ContextMenu
            position={contextMenu.position}
            menuItems={contextMenu.menuItems}
            onClose={handleCloseContextMenu}
          />
        </Portal>
      )}
      {showAsideSection && (
        <AsideSection onClose={closeDefinitionSection}>
          {definitions ? (
            definitions?.map((definition) => (
              <div key={definition.partOfSpeech}>
                <h2>{definition.partOfSpeech}</h2>
                <ul>
                  {definition.definitions.map((def) => (
                    <li key={def.definition}>
                      <div>
                        <b>Definition:</b> {def.definition}
                      </div>
                      {def.example && (
                        <>
                          <br />
                          <div>
                            <b>Example:</b> {def.example}
                          </div>
                        </>
                      )}
                      <hr />
                      <br />
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <>Sorry, we are unaware of this word!</>
          )}
        </AsideSection>
      )}
    </>
  );
};

export default HtmlContentDisplay;
