/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates. (Original MIT License)
 * Copyright (c) 2024 Mohammed Adil Sharif.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * This file is a modified version of the original.
 * (Original file: https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/CollapsiblePlugin/CollapsibleContentNode.ts)
 */

import {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  ElementNode,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedElementNode,
  Spread,
} from "lexical";
import { IS_CHROME } from "../utils/environment";
import invariant from "invariant";

import { $isCollapsibleLinkContainerNode } from "./CollapsibleLinkContainerNode";
import {
  domOnBeforeMatch,
  setDomHiddenUntilFound,
} from "./CollapsibleLinkUtils";

type SerializedCollapsibleLinkContentNode = SerializedElementNode;

export function $convertCollapsibleLinkContentElement(
  domNode: HTMLElement
): DOMConversionOutput | null {
  const node = $createCollapsibleLinkContentNode(""); // providing content here, causing duplication.
  return {
    node,
  };
}

export class CollapsibleLinkContentNode extends ElementNode {
  __content: string;

  constructor(content: string, key?: NodeKey) {
    super(key);
    this.__content = content;
  }
  static getType(): string {
    return "collapsible-content";
  }

  static clone(node: CollapsibleLinkContentNode): CollapsibleLinkContentNode {
    return new CollapsibleLinkContentNode(node.__content, node.__key);
  }

  createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {
    let dom = undefined;
    dom = document.createElement("div");
    dom.classList.add("CollapsibleLink__content");
    dom.innerHTML = this.__content;
    // console.log("content: ", dom);
    dom.style.height = "auto";
    dom.contentEditable = "false";
    if (IS_CHROME) {
      editor.getEditorState().read(() => {
        const containerNode = this.getParentOrThrow();
        invariant(
          $isCollapsibleLinkContainerNode(containerNode),
          "Expected parent node to be a CollapsibleContainerNode"
        );
        if (!containerNode.__open) {
          setDomHiddenUntilFound(dom);
        }
      });
      domOnBeforeMatch(dom, () => {
        editor.update(() => {
          const containerNode = this.getParentOrThrow().getLatest();
          invariant(
            $isCollapsibleLinkContainerNode(containerNode),
            "Expected parent node to be a CollapsibleContainerNode"
          );
          if (!containerNode.__open) {
            containerNode.toggleOpen();
          }
        });
      });
    }
    return dom;
  }

  updateDOM(prevNode: CollapsibleLinkContentNode, dom: HTMLElement): boolean {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute("data-lexical-collapsible-content")) {
          return null;
        }
        return {
          conversion: $convertCollapsibleLinkContentElement,
          priority: 2,
        };
      },
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("div");
    element.classList.add("CollapsibleLink__content");
    element.setAttribute("data-lexical-collapsible-content", "true");
    return { element };
  }

  static importJSON(
    serializedNode: SerializedCollapsibleLinkContentNode
  ): CollapsibleLinkContentNode {
    console.error("Error: importJSON() is not implemented!!");
    return $createCollapsibleLinkContentNode("");
  }

  isShadowRoot(): boolean {
    return true;
  }

  exportJSON(): SerializedCollapsibleLinkContentNode {
    return {
      ...super.exportJSON(),
      type: "collapsible-content",
      version: 1,
    };
  }
}

export function $createCollapsibleLinkContentNode(
  content: string
): CollapsibleLinkContentNode {
  return new CollapsibleLinkContentNode(content);
}

export function $isCollapsibleLinkContentNode(
  node: LexicalNode | null | undefined
): node is CollapsibleLinkContentNode {
  return node instanceof CollapsibleLinkContentNode;
}
