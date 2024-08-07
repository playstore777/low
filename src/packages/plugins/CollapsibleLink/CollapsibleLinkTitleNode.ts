/**
 * Copyright (c) Meta Platforms, Inc. and affiliates. (Original MIT License)
 * Copyright (c) 2024 Mohammed Adil Sharif.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * This file is a modified version of the original.
 * (Original file: https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/CollapsiblePlugin/CollapsibleTitleNode.ts)
 */

import {
  $createParagraphNode,
  $createTextNode,
  $isElementNode,
  DOMConversionMap,
  DOMConversionOutput,
  EditorConfig,
  ElementNode,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  RangeSelection,
  SerializedElementNode,
} from "lexical";
import { IS_CHROME } from "../utils/environment";
import invariant from "invariant";

import { $isCollapsibleLinkContainerNode } from "./CollapsibleLinkContainerNode";
import { $isCollapsibleLinkContentNode } from "./CollapsibleLinkContentNode";

type SerializedCollapsibleLinkTitleNode = SerializedElementNode;

export function $convertSummaryElement(
  domNode: HTMLElement
): DOMConversionOutput | null {
  const node = $createCollapsibleLinkTitleNode(domNode.innerHTML!);
  return {
    node,
  };
}

export class CollapsibleLinkTitleNode extends ElementNode {
  __title: string;

  constructor(title: string, key?: NodeKey) {
    super(key);
    this.__title = title;
  }
  static getType(): string {
    return "collapsible-title";
  }

  static clone(node: CollapsibleLinkTitleNode): CollapsibleLinkTitleNode {
    return new CollapsibleLinkTitleNode(node.__title, node.__key);
  }

  createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {
    const dom = document.createElement("summary");
    dom.classList.add("CollapsibleLink__title");
    dom.contentEditable = "false";
    if (IS_CHROME) {
      dom.addEventListener("click", () => {
        editor.update(() => {
          const collapsibleContainer = this.getLatest().getParentOrThrow();
          invariant(
            $isCollapsibleLinkContainerNode(collapsibleContainer),
            "Expected parent node to be a CollapsibleContainerNode"
          );
          collapsibleContainer.toggleOpen();
        });
      });
    }
    return dom;
  }

  updateDOM(prevNode: CollapsibleLinkTitleNode, dom: HTMLElement): boolean {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      summary: (domNode: HTMLElement) => {
        return {
          conversion: $convertSummaryElement,
          priority: 1,
        };
      },
    };
  }

  static importJSON(
    serializedNode: SerializedCollapsibleLinkTitleNode
  ): CollapsibleLinkTitleNode {
    console.error("Error: importJSON() is not implemented!!", serializedNode);
    return $createCollapsibleLinkTitleNode("");
  }

  exportJSON(): SerializedCollapsibleLinkTitleNode {
    return {
      ...super.exportJSON(),
      type: "collapsible-title",
      version: 1,
    };
  }

  collapseAtStart(_selection: RangeSelection): boolean {
    this.getParentOrThrow().insertBefore(this);
    return true;
  }

  insertNewAfter(_: RangeSelection, restoreSelection = true): ElementNode {
    const containerNode = this.getParentOrThrow();
    // console.log("title from inserNewAfter: ", this.__title);
    const textNode = $createTextNode(this.__title);

    if (!$isCollapsibleLinkContainerNode(containerNode)) {
      throw new Error(
        "CollapsibleLinkTitleNode expects to be child of CollapsibleContainerNode"
      );
    }

    if (containerNode.getOpen()) {
      const contentNode = this.getNextSibling();
      if (!$isCollapsibleLinkContentNode(contentNode)) {
        throw new Error(
          "CollapsibleLinkTitleNode expects to have CollapsibleContentNode sibling"
        );
      }

      const firstChild = contentNode.getFirstChild();
      if ($isElementNode(firstChild)) {
        return firstChild;
      } else {
        const paragraph = $createParagraphNode();
        paragraph.append(textNode);
        contentNode.append(paragraph);
        return paragraph;
      }
    } else {
      const paragraph = $createParagraphNode();
      paragraph.append(textNode);
      containerNode.insertAfter(paragraph, restoreSelection);
      return paragraph;
    }
  }
}

export function $createCollapsibleLinkTitleNode(
  title: string
): CollapsibleLinkTitleNode {
  return new CollapsibleLinkTitleNode(title);
}

export function $isCollapsibleLinkTitleNode(
  node: LexicalNode | null | undefined
): node is CollapsibleLinkTitleNode {
  return node instanceof CollapsibleLinkTitleNode;
}
