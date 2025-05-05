import { useEffect, useId, useRef, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import type { Editor } from "@sapo/tinymce";
import { useTheme } from "@/ui-components";

import { sanitize } from "./RichTextEditor/sanitize";
import { defaultContentStyle, defaultTinymceInitConfig, loadTinymce } from "./RichTextEditor/tinymce";

type Props = {
  id?: string;
  value: string;
  height?: number | string;
  maxHeight?: number;
  viewMode?: "raw" | "disabled";
  onAfterPrint?(): void;
};

export const PreviewHtml = ({ id: idProp, value: valueProp, maxHeight, height, viewMode, onAfterPrint }: Props) => {
  const editorRef = useRef<Editor | null>();
  const autoId = useId();
  const [isReady, setReady] = useState(false);
  const id = idProp ?? `preview-${autoId}`.replaceAll(":", "");
  const isPrint = !!onAfterPrint;

  const theme = useTheme();

  const initEditor = async () => {
    const tinymce = await loadTinymce();

    await tinymce.init({
      ...defaultTinymceInitConfig,
      selector: `#${id}`,
      content_style:
        viewMode !== "raw"
          ? defaultContentStyle.concat(
              viewMode === "disabled" ? `body {  background-color: ${theme.colors.backgroundSelected}; }` : ""
            )
          : "",
      readonly: true,
      min_height: isPrint ? 0 : 150,
      height: isPrint ? 0 : height,
      max_height: isPrint ? 0 : maxHeight,
      plugins: "",
      init_instance_callback(editor) {
        editorRef.current = editor;
        setReady(true);
      },
      setup: (editor) => {
        editor.on("init", () => {
          const wd = editor.iframeElement?.contentWindow;
          if (!wd || !onAfterPrint) {
            return;
          }
          editor.setContent(valueProp);
          wd.onafterprint = onAfterPrint;
          setTimeout(() => editor.execCommand("mcePrint"), 0);
        });
        editor.on("BeforeSetContent", (event) => {
          event.content = sanitize(event.content);
        });
      },
    });
  };

  useEffect(() => {
    initEditor();

    return () => {
      if (editorRef.current) {
        editorRef.current.off();
        editorRef.current.remove();
        editorRef.current = null;
      }
    };
    // only init once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!editorRef.current || !isReady) {
      return;
    }
    editorRef.current.setContent(valueProp);
  }, [isReady, valueProp]);

  const noHeight = maxHeight === -1;

  return (
    <StyledPreviewHtml noHeight={noHeight} style={isPrint ? { display: "none" } : undefined}>
      <StyledTextareaPlainView id={id} />
    </StyledPreviewHtml>
  );
};

const StyledTextareaPlainView = styled.textarea`
  display: none;
`;

const StyledPreviewHtml = styled.div<{
  noHeight?: boolean;
}>`
  height: 100%;
  position: relative;
  .tox-tinymce {
    border: 0;
    border-radius: 0;
  }

  ${(p) =>
    p.noHeight &&
    css`
      height: 100%;
      .tox-tinymce {
        height: 100% !important;
      }
    `}
`;
