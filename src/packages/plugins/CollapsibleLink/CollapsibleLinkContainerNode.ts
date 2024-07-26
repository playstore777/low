/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * Copyright (c) 2024 Mohammed Adil Sharif.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * This file is a modified version of the original.
 * (Original file: https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/CollapsiblePlugin/CollapsibleContainerNode.ts)
 */

import {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  ElementNode,
  isHTMLElement,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedElementNode,
  Spread,
} from "lexical";
import { IS_CHROME } from "../utils/environment";

import { setDomHiddenUntilFound } from "./CollapsibleLinkUtils";

import invariant from "invariant";

type SerializedCollapsibleLinkContainerNode = Spread<
  {
    open: boolean;
    dataPostUrl: string;
  },
  SerializedElementNode
>;

export function $convertDetailsElement(
  domNode: HTMLDetailsElement
): DOMConversionOutput | null {
  const isOpen = domNode.open !== undefined ? domNode.open : true;
  const node = $createCollapsibleLinkContainerNode(
    isOpen,
    domNode.dataset.postUrl!
  );
  return {
    node,
  };
}

export class CollapsibleLinkContainerNode extends ElementNode {
  __open: boolean;
  __postUrl: string;

  constructor(open: boolean, url: string = "", key?: NodeKey) {
    super(key);
    this.__open = open;
    this.__postUrl = url;
  }

  static getType(): string {
    return "collapsible-container";
  }

  static clone(
    node: CollapsibleLinkContainerNode
  ): CollapsibleLinkContainerNode {
    return new CollapsibleLinkContainerNode(
      node.__open,
      node.__postUrl,
      node.__key
    );
  }

  createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {
    // details is not well supported in Chrome #5582
    let dom: HTMLElement;
    if (IS_CHROME) {
      dom = document.createElement("div");
      dom.setAttribute("open", "");
    } else {
      const detailsDom = document.createElement("details");
      detailsDom.open = this.__open;
      detailsDom.addEventListener("toggle", () => {
        const open = editor.getEditorState().read(() => this.getOpen());
        if (open !== detailsDom.open) {
          editor.update(() => this.toggleOpen());
        }
      });
      dom = detailsDom;
    }
    dom.dataset.postUrl = this.__postUrl;
    dom.classList.add("CollapsibleLink__container");

    return dom;
  }

  updateDOM(
    prevNode: CollapsibleLinkContainerNode,
    dom: HTMLDetailsElement
  ): boolean {
    const currentOpen = this.__open;
    if (prevNode.__open !== currentOpen) {
      // details is not well supported in Chrome #5582
      if (IS_CHROME) {
        const contentDom = dom.children[1];
        invariant(
          isHTMLElement(contentDom),
          "Expected contentDom to be an HTMLElement"
        );
        if (currentOpen) {
          dom.setAttribute("open", "");
          contentDom.hidden = false;
        } else {
          dom.removeAttribute("open");
          setDomHiddenUntilFound(contentDom);
        }
      } else {
        dom.open = this.__open;
      }
    }

    return false;
  }

  static importDOM(): DOMConversionMap<HTMLDetailsElement> | null {
    return {
      details: (domNode: HTMLDetailsElement) => {
        return {
          conversion: $convertDetailsElement,
          priority: 1,
          postUrl: domNode.dataset.postUrl,
        };
      },
    };
  }

  static importJSON(
    serializedNode: SerializedCollapsibleLinkContainerNode
  ): CollapsibleLinkContainerNode {
    const node = $createCollapsibleLinkContainerNode(
      serializedNode.open,
      serializedNode.dataPostUrl
    );
    return node;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("details");
    element.classList.add("CollapsibleLink__container");
    element.setAttribute("open", this.__open.toString());
    element.dataset.postUrl = this.__postUrl;
    return { element };
  }

  exportJSON(): SerializedCollapsibleLinkContainerNode {
    return {
      ...super.exportJSON(),
      open: this.__open,
      type: "collapsible-container",
      version: 1,
      dataPostUrl: this.__postUrl,
    };
  }

  setOpen(open: boolean): void {
    const writable = this.getWritable();
    writable.__open = open;
  }

  getOpen(): boolean {
    return this.getLatest().__open;
  }

  toggleOpen(): void {
    this.setOpen(!this.getOpen());
  }
}

export function $createCollapsibleLinkContainerNode(
  isOpen: boolean,
  url: string
): CollapsibleLinkContainerNode {
  return new CollapsibleLinkContainerNode(isOpen, url);
}

export function $isCollapsibleLinkContainerNode(
  node: LexicalNode | null | undefined
): node is CollapsibleLinkContainerNode {
  return node instanceof CollapsibleLinkContainerNode;
}
