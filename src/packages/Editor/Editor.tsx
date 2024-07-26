import { useEffect, useState } from "react";

import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $getSelection, EditorState, LexicalEditor } from "lexical";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { CodeNode } from "@lexical/code";

import FloatingLinkEditorPlugin from "../plugins/FloatingLinkEditorPlugin";
import { CollapsibleLinkContainerNode } from "../plugins/CollapsibleLink/CollapsibleLinkContainerNode";
import { CollapsibleLinkContentNode } from "../plugins/CollapsibleLink/CollapsibleLinkContentNode";
import { CollapsibleLinkTitleNode } from "../plugins/CollapsibleLink/CollapsibleLinkTitleNode";
import ToolbarPlugin from "../plugins/toolbarPlugin/toolbarplugin";
import { MyOnChangePlugin } from "../plugins/MyOnChangePlugin";
import CollapsibleLinkPlugin from "../plugins/CollapsibleLink";
import TreeViewPlugin from "../plugins/ui/TreeViewPlugin";
import AutoLinkPlugin from "../plugins/AutoLinkPlugin";
import { ImageNode } from "../plugins/nodes/ImageNode";
import ImagesPlugin from "../plugins/ImagesPlugin";
import LinkPlugin from "../plugins/LinkPlugin";
import "./Editor.css";
import { fetchDataMethod } from "../plugins/types";

const onError = (error: unknown) => {
  console.error("Custom error from Lexical Editor: ", error);
};

const EditorInitializer = ({
  initialEditorState,
}: {
  initialEditorState?: string;
}) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (initialEditorState) {
      editor.update(() => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(initialEditorState, "text/html");
        console.log(doc);
        const nodes = $generateNodesFromDOM(editor, doc);

        const root = $getRoot();
        root.clear();
        root.append(...nodes);

        const selection = $getSelection();
        if (selection) {
          selection.dirty = true;
        }
      });
    }
  }, [editor, initialEditorState]);

  return null;
};

const Editor = ({
  namespace,
  readonly = false,
  initialEditorState,
  fetchPost,
  onInputChange,
}: {
  namespace: string;
  readonly?: boolean;
  initialEditorState?: string;
  fetchPost: fetchDataMethod;
  onInputChange: (key: string, value: string) => void;
}) => {
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<
    HTMLDivElement | undefined
  >(undefined);
  const initialConfig = {
    namespace: namespace ?? "MyEditor",
    nodes: [
      HeadingNode,
      HorizontalRuleNode,
      QuoteNode,
      CodeNode,
      LinkNode,
      AutoLinkNode,
      ImageNode,
      CollapsibleLinkContainerNode,
      CollapsibleLinkTitleNode,
      CollapsibleLinkContentNode,
    ],
    editable: !readonly,
    onError,
  };

  const onChange = (editorState: EditorState, lexicalEditor: LexicalEditor) => {
    if (editorState && lexicalEditor) {
      let htmlString = "";
      editorState.read(() => {
        htmlString = $generateHtmlFromNodes(lexicalEditor);
      });
      if (htmlString === "<p><br></p>") onInputChange("content", "");
      else onInputChange("content", htmlString);
    }
  };

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <>
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin
          setIsLinkEditMode={setIsLinkEditMode}
          fetchPost={fetchPost}
        />
        <RichTextPlugin
          contentEditable={
            <div className="editor" ref={onRef}>
              <ContentEditable />
            </div>
          }
          placeholder={<></>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <LinkPlugin />
        <AutoLinkPlugin />
        <ImagesPlugin />
        {floatingAnchorElem && (
          <FloatingLinkEditorPlugin
            anchorElem={floatingAnchorElem}
            isLinkEditMode={isLinkEditMode}
            setIsLinkEditMode={setIsLinkEditMode}
          />
        )}
        <HorizontalRulePlugin />
        <MyOnChangePlugin onChange={onChange} />
        <CollapsibleLinkPlugin />
        <EditorInitializer initialEditorState={initialEditorState} />
        <TreeViewPlugin /> {/* just for testing purpose!! */}
      </LexicalComposer>
    </>
  );
};

export default Editor;
