/**
 * Copyright (c) Meta Platforms, Inc. and affiliates. (Original MIT License)
 * Copyright (c) 2024 Mohammed Adil Sharif.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * This file is a modified version of the original.
 * (Original file: https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/nodes/ImageComponent.tsx)
 */

import type {
  BaseSelection,
  LexicalCommand,
  LexicalEditor,
  NodeKey,
} from "lexical";

import "./ImageNode.css";

import { HashtagNode } from "@lexical/hashtag";
import { LinkNode } from "@lexical/link";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { LexicalNestedComposer } from "@lexical/react/LexicalNestedComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $isRangeSelection,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DRAGSTART_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  LineBreakNode,
  ParagraphNode,
  RootNode,
  SELECTION_CHANGE_COMMAND,
  TextNode,
} from "lexical";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";

import brokenImage from "../images/image-broken.svg";
import LinkPlugin from "../LinkPlugin";
import Placeholder from "../ui/Placeholder";
import { $isImageNode } from "./ImageNode";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";

const imageCache = new Set();

export const RIGHT_CLICK_IMAGE_COMMAND: LexicalCommand<MouseEvent> =
  createCommand("RIGHT_CLICK_IMAGE_COMMAND");

function useSuspenseImage(src: string) {
  if (!imageCache.has(src)) {
    throw new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageCache.add(src);
        resolve(null);
      };
      img.style.display = "block";
      img.style.margin = "auto";
      img.style.maxWidth = "800px";
      img.onerror = () => {
        imageCache.add(src);
      };
    });
  }
}

function LazyImage({
  altText,
  className,
  imageRef,
  src,
  width,
  height,
  maxWidth = 379,
  onError,
}: {
  altText: string;
  className: string | null;
  height: "inherit" | number;
  imageRef: { current: null | HTMLImageElement };
  maxWidth: number;
  src: string;
  width: "inherit" | number;
  onError: () => void;
}): JSX.Element {
  useSuspenseImage(src);
  return (
    <img
      className={className || undefined}
      src={src}
      alt={altText}
      ref={imageRef}
      style={{
        height,
        maxWidth: maxWidth + "px",
        width,
      }}
      onError={onError}
      draggable="false"
    />
  );
}

function BrokenImage(): JSX.Element {
  return (
    <img
      src={brokenImage}
      style={{
        height: 200,
        opacity: 0.2,
        width: 200,
      }}
      draggable="false"
    />
  );
}

export default function ImageComponent({
  src,
  altText,
  nodeKey,
  width,
  height,
  maxWidth,
  resizable,
  showCaption,
  caption,
  captionsEnabled,
  unsplashCaption,
}: {
  altText: string;
  caption: LexicalEditor;
  height: "inherit" | number;
  maxWidth: number;
  nodeKey: NodeKey;
  resizable: boolean;
  showCaption: boolean;
  src: string;
  width: "inherit" | number;
  captionsEnabled: boolean;
  unsplashCaption?: string;
}): JSX.Element {
  const imageRef = useRef<null | HTMLImageElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const [editor] = useLexicalComposerContext();
  const [selection, setSelection] = useState<BaseSelection | null>(null);
  const activeEditorRef = useRef<LexicalEditor | null>(null);
  const [isLoadError, setIsLoadError] = useState<boolean>(false);

  const $onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload;
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if ($isImageNode(node)) {
          node.remove();
          return true;
        }
      }
      return false;
    },
    [isSelected, nodeKey]
  );

  const $onEnter = useCallback(
    (event: KeyboardEvent) => {
      const latestSelection = $getSelection();
      const buttonElem = buttonRef.current;
      if (
        isSelected &&
        $isNodeSelection(latestSelection) &&
        latestSelection.getNodes().length === 1
      ) {
        if (showCaption) {
          // Move focus into nested editor
          $setSelection(null);
          event.preventDefault();
          caption.focus();
          return true;
        } else if (
          buttonElem !== null &&
          buttonElem !== document.activeElement
        ) {
          event.preventDefault();
          buttonElem.focus();
          return true;
        }
      }
      return false;
    },
    [caption, isSelected, showCaption]
  );

  const $onEscape = useCallback(
    (event: KeyboardEvent) => {
      if (
        activeEditorRef.current === caption ||
        buttonRef.current === event.target
      ) {
        $setSelection(null);
        editor.update(() => {
          setSelected(true);
          const parentRootElement = editor.getRootElement();
          if (parentRootElement !== null) {
            parentRootElement.focus();
          }
        });
        return true;
      }
      return false;
    },
    [caption, editor, setSelected]
  );

  const onClick = useCallback(
    (payload: MouseEvent) => {
      const event = payload;

      if (event.target === imageRef.current) {
        if (event.shiftKey) {
          setSelected(!isSelected);
        } else {
          clearSelection();
          setSelected(true);
        }
        return true;
      }

      return false;
    },
    [isSelected, setSelected, clearSelection]
  );

  const onRightClick = useCallback(
    (event: MouseEvent): void => {
      editor.getEditorState().read(() => {
        const latestSelection = $getSelection();
        const domElement = event.target as HTMLElement;
        if (
          domElement.tagName === "IMG" &&
          $isRangeSelection(latestSelection) &&
          latestSelection.getNodes().length === 1
        ) {
          editor.dispatchCommand(
            RIGHT_CLICK_IMAGE_COMMAND,
            event as MouseEvent
          );
        }
      });
    },
    [editor]
  );

  useEffect(() => {
    let isMounted = true;
    const rootElement = editor.getRootElement();
    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        if (isMounted) {
          setSelection(editorState.read(() => $getSelection()));
        }
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor;
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        onClick,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<MouseEvent>(
        RIGHT_CLICK_IMAGE_COMMAND,
        onClick,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          if (event.target === imageRef.current) {
            // TODO This is just a temporary workaround for FF to behave like other browsers.
            // Ideally, this handles drag & drop too (and all browsers).
            event.preventDefault();
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        $onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        $onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(KEY_ENTER_COMMAND, $onEnter, COMMAND_PRIORITY_LOW),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        $onEscape,
        COMMAND_PRIORITY_LOW
      )
    );

    rootElement?.addEventListener("contextmenu", onRightClick);

    return () => {
      isMounted = false;
      unregister();
      rootElement?.removeEventListener("contextmenu", onRightClick);
    };
  }, [
    clearSelection,
    editor,
    isSelected,
    nodeKey,
    $onDelete,
    $onEnter,
    $onEscape,
    onClick,
    onRightClick,
    setSelected,
  ]);

  const draggable = isSelected && $isNodeSelection(selection);
  const isFocused = isSelected;
  return (
    <Suspense fallback={null}>
      <>
        <div draggable={draggable}>
          {isLoadError ? (
            <BrokenImage />
          ) : (
            <LazyImage
              className={
                isFocused
                  ? `focused ${$isNodeSelection(selection) ? "draggable" : ""}`
                  : null
              }
              src={src}
              altText={altText}
              imageRef={imageRef}
              width={width}
              height={height}
              maxWidth={maxWidth}
              onError={() => setIsLoadError(true)}
            />
          )}
        </div>
        {unsplashCaption && (
          <div dangerouslySetInnerHTML={{ __html: unsplashCaption }}></div>
        )}

        {showCaption && (
          <div className="image-caption-container">
            <LexicalNestedComposer
              initialEditor={caption}
              initialNodes={[
                RootNode,
                TextNode,
                LineBreakNode,
                ParagraphNode,
                LinkNode,
                HashtagNode,
              ]}
            >
              <AutoFocusPlugin />
              <LinkPlugin />
              <HashtagPlugin />
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="ImageNode__contentEditable" />
                }
                placeholder={
                  <Placeholder className="ImageNode__placeholder">
                    Enter a caption...
                  </Placeholder>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
            </LexicalNestedComposer>
          </div>
        )}
      </>
    </Suspense>
  );
}
