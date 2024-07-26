/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * Copyright (c) 2024 Mohammed Adil Sharif.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * This file is a modified version of the original.
 * (Original file: https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/CollapsiblePlugin/index.ts)
 */

import "./CollapsibleLink.css";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $findMatchingParent,
  $insertNodeToNearestRoot,
  mergeRegister,
} from "@lexical/utils";
import {
  $createParagraphNode,
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DELETE_CHARACTER_COMMAND,
  ElementNode,
  INSERT_PARAGRAPH_COMMAND,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_LEFT_COMMAND,
  KEY_ARROW_RIGHT_COMMAND,
  KEY_ARROW_UP_COMMAND,
  LexicalNode,
  NodeKey,
} from "lexical";
import { useEffect } from "react";

import {
  $createCollapsibleLinkContainerNode,
  $isCollapsibleLinkContainerNode,
  CollapsibleLinkContainerNode as CollapsibleLinkContainerNode,
} from "./CollapsibleLinkContainerNode";
import {
  $createCollapsibleLinkContentNode,
  $isCollapsibleLinkContentNode,
  CollapsibleLinkContentNode as CollapsibleLinkContentNode,
} from "./CollapsibleLinkContentNode";
import {
  $createCollapsibleLinkTitleNode,
  $isCollapsibleLinkTitleNode,
  CollapsibleLinkTitleNode as CollapsibleLinkTitleNode,
} from "./CollapsibleLinkTitleNode";
import { Post } from "../types";

export const INSERT_COLLAPSIBLE_COMMAND = createCommand<{ url: string }>();
export const TOGGLE_COLLAPSIBLE_COMMAND = createCommand<NodeKey>();

export default function CollapsibleLinkPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (
      !editor.hasNodes([
        CollapsibleLinkContainerNode,
        CollapsibleLinkTitleNode,
        CollapsibleLinkContentNode,
      ])
    ) {
      throw new Error(
        "CollapsiblePlugin: CollapsibleContainerNode, CollapsibleTitleNode, or CollapsibleContentNode not registered on editor"
      );
    }

    const $onEscapeUp = () => {
      const selection = $getSelection();
      if (
        $isRangeSelection(selection) &&
        selection.isCollapsed() &&
        selection.anchor.offset === 0
      ) {
        const container = $findMatchingParent(
          selection.anchor.getNode(),
          $isCollapsibleLinkContainerNode
        );

        if ($isCollapsibleLinkContainerNode(container)) {
          const parent = container.getParent<ElementNode>();
          if (
            parent !== null &&
            parent.getFirstChild<LexicalNode>() === container &&
            selection.anchor.key ===
              container.getFirstDescendant<LexicalNode>()?.getKey()
          ) {
            container.insertBefore($createParagraphNode());
          }
        }
      }

      return false;
    };

    const $onEscapeDown = () => {
      const selection = $getSelection();
      if ($isRangeSelection(selection) && selection.isCollapsed()) {
        const container = $findMatchingParent(
          selection.anchor.getNode(),
          $isCollapsibleLinkContainerNode
        );

        if ($isCollapsibleLinkContainerNode(container)) {
          const parent = container.getParent<ElementNode>();
          if (
            parent !== null &&
            parent.getLastChild<LexicalNode>() === container
          ) {
            const titleParagraph = container.getFirstDescendant<LexicalNode>();
            const contentParagraph = container.getLastDescendant<LexicalNode>();

            if (
              (contentParagraph !== null &&
                selection.anchor.key === contentParagraph.getKey() &&
                selection.anchor.offset ===
                  contentParagraph.getTextContentSize()) ||
              (titleParagraph !== null &&
                selection.anchor.key === titleParagraph.getKey() &&
                selection.anchor.offset === titleParagraph.getTextContentSize())
            ) {
              container.insertAfter($createParagraphNode());
            }
          }
        }
      }

      return false;
    };

    return mergeRegister(
      // Structure enforcing transformers for each node type. In case nesting structure is not
      // "Container > Title + Content" it'll unwrap nodes and convert it back
      // to regular content.
      editor.registerNodeTransform(CollapsibleLinkContentNode, (node) => {
        const parent = node.getParent<ElementNode>();
        if (!$isCollapsibleLinkContainerNode(parent)) {
          const children = node.getChildren<LexicalNode>();
          for (const child of children) {
            node.insertBefore(child);
          }
          node.remove();
        }
      }),

      editor.registerNodeTransform(CollapsibleLinkTitleNode, (node) => {
        const parent = node.getParent<ElementNode>();
        if (!$isCollapsibleLinkContainerNode(parent)) {
          node.replace(
            $createParagraphNode().append(...node.getChildren<LexicalNode>())
          );
          return;
        }
      }),

      editor.registerNodeTransform(CollapsibleLinkContainerNode, (node) => {
        const children = node.getChildren<LexicalNode>();
        if (
          children.length !== 2 ||
          !$isCollapsibleLinkTitleNode(children[0]) ||
          !$isCollapsibleLinkContentNode(children[1])
        ) {
          for (const child of children) {
            node.insertBefore(child);
          }
          node.remove();
        }
      }),

      // This handles the case when container is collapsed and we delete its previous sibling
      // into it, it would cause collapsed content deleted (since it's display: none, and selection
      // swallows it when deletes single char). Instead we expand container, which is although
      // not perfect, but avoids bigger problem
      editor.registerCommand(
        DELETE_CHARACTER_COMMAND,
        () => {
          const selection = $getSelection();
          if (
            !$isRangeSelection(selection) ||
            !selection.isCollapsed() ||
            selection.anchor.offset !== 0
          ) {
            return false;
          }

          const anchorNode = selection.anchor.getNode();
          const topLevelElement = anchorNode.getTopLevelElement();
          if (topLevelElement === null) {
            return false;
          }

          const container = topLevelElement.getPreviousSibling<LexicalNode>();
          if (
            !$isCollapsibleLinkContainerNode(container) ||
            container.getOpen()
          ) {
            return false;
          }

          container.setOpen(true);
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),

      // When collapsible is the last child pressing down/right arrow will insert paragraph
      // below it to allow adding more content. It's similar what $insertBlockNode
      // (mainly for decorators), except it'll always be possible to continue adding
      // new content even if trailing paragraph is accidentally deleted
      editor.registerCommand(
        KEY_ARROW_DOWN_COMMAND,
        $onEscapeDown,
        COMMAND_PRIORITY_LOW
      ),

      editor.registerCommand(
        KEY_ARROW_RIGHT_COMMAND,
        $onEscapeDown,
        COMMAND_PRIORITY_LOW
      ),

      // When collapsible is the first child pressing up/left arrow will insert paragraph
      // above it to allow adding more content. It's similar what $insertBlockNode
      // (mainly for decorators), except it'll always be possible to continue adding
      // new content even if leading paragraph is accidentally deleted
      editor.registerCommand(
        KEY_ARROW_UP_COMMAND,
        $onEscapeUp,
        COMMAND_PRIORITY_LOW
      ),

      editor.registerCommand(
        KEY_ARROW_LEFT_COMMAND,
        $onEscapeUp,
        COMMAND_PRIORITY_LOW
      ),

      // Enter goes from Title to Content rather than a new line inside Title
      editor.registerCommand(
        INSERT_PARAGRAPH_COMMAND,
        () => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const titleNode = $findMatchingParent(
              selection.anchor.getNode(),
              (node) => $isCollapsibleLinkTitleNode(node)
            );

            if ($isCollapsibleLinkTitleNode(titleNode)) {
              const container = titleNode.getParent<ElementNode>();
              if (container && $isCollapsibleLinkContainerNode(container)) {
                if (!container.getOpen()) {
                  container.toggleOpen();
                }
                titleNode.getNextSibling()?.selectEnd();
                return true;
              }
            }
          }

          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        INSERT_COLLAPSIBLE_COMMAND,
        (payload: Post & { url: string }) => {
          editor.update(() => {
            const title = $createCollapsibleLinkTitleNode(payload.title!);
            const paragraph = $createParagraphNode().append(
              $createTextNode(payload.title!)
            );
            $insertNodeToNearestRoot(
              $createCollapsibleLinkContainerNode(true, payload.url).append(
                title.append(paragraph),
                $createCollapsibleLinkContentNode(
                  payload?.content as string
                ).append($createParagraphNode())
              )
            );
            paragraph.select();
          });
          return true;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor]);

  return null;
}
