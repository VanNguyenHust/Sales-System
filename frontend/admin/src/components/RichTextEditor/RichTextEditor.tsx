/* eslint-disable react/no-unused-prop-types */
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import type { Editor, Events } from "@sapo/tinymce";
import { Icon, Labelled, Text, type TextFieldProps, Tooltip } from "@/ui-components";
import { InfoCircleOutlineIcon } from "@/ui-icons";
import { isNil } from "lodash-es";

import { isEmptyString } from "app/utils/form/predicates";

import { CodeEditor } from "../CodeEditor";

import { AIProps, Provider as AIProvider, RewriteSuggestModal, SuggestModal } from "./components/AISuggest";
import { EditImageModal } from "./components/EditImageModal";
import { InsertImageModal } from "./components/InsertImageModal";
import { InsertTableModal } from "./components/InsertTableModal";
import { InsertVideoModal } from "./components/InsertVideoModal";
import { Toolbar, ToolbarRef } from "./components/Toolbar";
import { UpdateLinkModal } from "./components/UpdateLinkModal";
import { FullscreenContext } from "./context";
import { desanitize, sanitize } from "./sanitize";
import { defaultContentStyle, defaultTinymceInitConfig, disabledContentStyle, loadTinymce } from "./tinymce";
import {
  blackColor,
  ExclusionType,
  ExecCommandArgs,
  fontSizeList,
  LinkSelectionTypes,
  LinkTarget,
  LinkType,
  ModalNames,
  PopoverActionType,
  TEXT_AREA_MIN_HEIGHT,
  TEXT_AREA_PAD,
  TextStyleTypes,
  TOOLBAR_HEIGHT,
  TypographyElement,
  whiteColor,
} from "./types";

export type ViewMode = "viewOnly" | "disabled" | "edit";

const parser = new DOMParser();

type Props = Pick<
  TextFieldProps,
  | "name"
  | "label"
  | "labelAction"
  | "labelTooltip"
  | "onBlur"
  | "onFocus"
  | "showCharacterCount"
  | "maxLength"
  | "error"
  | "requiredIndicator"
> &
  AIProps & {
    id: string;
    value: string;
    viewMode?: ViewMode;
    displayToolbar?: boolean;
    exclusions?: ExclusionType[];
    onChange(value: string): void;
    maxHeight?: number;
    /**
     * @default "html"
     */
    characterCountType?: "html" | "character";
    onCharacterCountChange?(count: number): void;
  };

export type RichTextEditorRef = {
  remeasureElements(): void;
};

export const RichTextEditor = React.memo(
  React.forwardRef<RichTextEditorRef, Props>(function RichTextEditor(
    {
      id,
      value: valueProp,
      viewMode = "edit",
      displayToolbar = true,
      name,
      label,
      labelAction,
      labelTooltip,
      error,
      requiredIndicator,
      exclusions,
      maxLength,
      showCharacterCount,
      onBlur,
      onFocus,
      onChange,
      maxHeight,
      aiSuggestContext,
      aiSuggestExtraContext,
      characterCountType = "html",
      onCharacterCountChange,
    },
    ref
  ) {
    const [isShowHTML, setShowHTML] = useState(false);
    const [isFullscreen, setFullscreen] = useState(false);
    const [textareaHeight, setTextareaHeight] = useState(TEXT_AREA_MIN_HEIGHT);
    const [isCodeEditorReady, setCodeEditorReady] = useState(false);
    const [isEditorReady, setEditorReady] = useState(false);
    const [focused, setFocused] = useState(false);
    const toolbarRef = useRef<ToolbarRef>(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const editorRef = useRef<Editor | null>();
    const isReadOnly = ["disabled", "viewOnly"].includes(viewMode);

    useImperativeHandle(ref, () => ({
      remeasureElements: () => toolbarRef.current?.remeasureElements(),
    }));

    const [textModifierState, setTextModifierState] = useState({
      bold: false,
      italic: false,
      underline: false,
      orderedList: false,
      unorderedList: false,
    });
    const [selectedTypographicElement, setSelectedTypographicElement] = useState<TypographyElement | undefined>();
    const [selectedFontSize, setSelectedFontSize] = useState<string | undefined>();
    const [selectedTextAligment, setSelectedTextAligment] = useState<string | undefined>();
    const [selectedTextColor, setSelectedTextColor] = useState<string | undefined>();
    const [selectedBackgroundColor, setSelectedBackgroundColor] = useState<string | undefined>();
    const [popoverVisible, setPopoverVisible] = useState<PopoverActionType | undefined>();
    const [isOverflowVisible, setOverflowVisible] = useState(false);
    const [modalName, setModalName] = useState<ModalNames | undefined>();
    const [linkSelectionType, setLinkSelectionType] = useState(LinkSelectionTypes.Empty);
    const [selectedLink, setSelectedLink] = useState<
      | {
          href: string;
          target: LinkTarget;
          title: string;
        }
      | undefined
    >(undefined);
    const [selectedImage, setSelectedImage] = useState<
      | {
          src: string;
          alt: string;
        }
      | undefined
    >(undefined);
    const [tableSelected, setTableSelected] = useState(false);
    const [selectionContent, setSelectionContent] = useState<string | undefined>();

    const handleCodeEditorLoad = () => {
      setCodeEditorReady(true);
    };

    const handleFocus = () => {
      onFocus?.();
      setFocused(true);
    };

    const handleBlur = () => {
      onBlur?.();
      setFocused(false);
    };

    const handleSwitchHTMLMode = useCallback(() => {
      if (!editorRef.current) {
        return;
      }
      setTextareaAttribute(isShowHTML ? !isCodeEditorReady : false);
      focused && editorRef.current.focus(true);
    }, [focused, isCodeEditorReady, isShowHTML]);

    const handleToggleHTML = () => {
      if (!editorRef.current) {
        return;
      }
      if (!isFullscreen) {
        const editorHeight = editorRef.current.getContentAreaContainer().clientHeight;
        if (editorHeight >= TEXT_AREA_MIN_HEIGHT + TEXT_AREA_PAD * 2) {
          setTextareaHeight(editorHeight);
        }
      }
      setShowHTML(!isShowHTML);
      setOverflowVisible(false);
      editorRef.current.focus(true);
    };

    const toggleFullscreen = () => {
      executeCommand("mceFullScreen");
    };

    const handleFullscreenStateChanged = ({ state }: { state: boolean }) => {
      setFullscreen(state);
    };

    const handleNodeSelect = (node: string) => {
      if (!editorRef.current) {
        return;
      }
      const isStyle = node !== TextStyleTypes.SelectNode;
      const nearestBold = findNearest("strong");
      const nearestItalic = findNearest("em");
      const nearestUnorderedList = findNearest("ul");
      const nearestOrderedList = findNearest("ol");
      const nearestSpan = findNearest("span");
      const nearestStyles = nearestSpan ? window.getComputedStyle(nearestSpan) : undefined;
      const headingNode = findNearestHeading();
      setSelectedTypographicElement(headingNode);
      setTextModifierState((current) => {
        const {
          bold: currentBold,
          italic: currentItalic,
          underline: currentUnderline,
          unorderedList: currentUnorderedList,
          orderedList: currentOrderedList,
        } = current;
        const [isBoldNode, isItalicNode, isUnderlineNode, isUnorderedList, isOrderedList] = [
          node === TextStyleTypes.Bold,
          node === TextStyleTypes.Italic,
          node === TextStyleTypes.Underline,
          node === TextStyleTypes.UnorderedList,
          node === TextStyleTypes.OrderedList,
        ];
        const bold = isBoldNode ? !currentBold : currentBold;
        const italic = isItalicNode ? !currentItalic : currentItalic;
        const underline = isUnderlineNode ? !currentUnderline : currentUnderline;
        const nearestUnderline = nearestStyles?.textDecoration?.includes(TextStyleTypes.Underline);
        const unorderedList = isUnorderedList ? !currentUnorderedList : currentUnorderedList;
        const orderedList = isOrderedList ? !currentOrderedList : currentOrderedList;
        return {
          ...current,
          bold: isStyle ? bold : !!nearestBold,
          italic: isStyle ? italic : !!nearestItalic,
          underline: isStyle ? underline : !!nearestUnderline,
          unorderedList: isStyle ? unorderedList : !!nearestUnorderedList,
          orderedList: isStyle ? orderedList : !!nearestOrderedList,
        };
      });
      const fontSize = editorRef.current.queryCommandValue("FontSize");
      setSelectedFontSize(fontSizeList.some(({ value }) => value === fontSize) ? fontSize : undefined);

      if (editorRef.current.queryCommandState("JustifyLeft")) {
        setSelectedTextAligment("left");
      } else if (editorRef.current.queryCommandState("JustifyCenter")) {
        setSelectedTextAligment("center");
      } else if (editorRef.current.queryCommandState("JustifyRight")) {
        setSelectedTextAligment("right");
      } else if (editorRef.current.queryCommandState("JustifyFull")) {
        setSelectedTextAligment("full");
      }
    };

    const handleNodeChange = () => {
      if (!editorRef.current) {
        return;
      }
      const htmlContent = editorRef.current.selection?.getContent();
      const linkNode = findNearest("A");
      const imgNode = findNearest("IMG");
      const tableNode = findNearest("TABLE");
      const headingNode = findNearestHeading();
      if (headingNode) {
        setSelectedTypographicElement(headingNode);
      }
      if (linkNode) {
        setLinkSelectionType(LinkSelectionTypes.Edit);
        setSelectedLink({
          href: linkNode.getAttribute("href") || "",
          target: (linkNode.getAttribute("target") as LinkTarget) || LinkTarget.Internal,
          title: linkNode.getAttribute("title") || "",
        });
      } else {
        if (htmlContent) {
          setLinkSelectionType(LinkSelectionTypes.Insert);
          setSelectedLink(undefined);
        } else {
          setLinkSelectionType(LinkSelectionTypes.Empty);
        }
      }

      if (imgNode) {
        const src = imgNode.getAttribute("src") ?? "";
        setSelectedImage({
          alt: imgNode.getAttribute("alt") ?? "",
          src,
        });
      } else {
        setSelectedImage(undefined);
      }
      setTableSelected(!!tableNode);
    };

    const executeCommand = (command: string, value?: any, args?: ExecCommandArgs) => {
      if (editorRef.current) {
        editorRef.current.execCommand(command, false, value, args);
      }
      if (isOverflowVisible) {
        setOverflowVisible(false);
      }
    };

    const findNearest = (node: string) => {
      if (editorRef.current) {
        return editorRef.current.dom.getParent(editorRef.current.selection.getNode(), node);
      }
    };

    const findNearestHeading = (): TypographyElement | undefined => {
      if (findNearest("p")) {
        return TypographyElement.Paragraph;
      }
      if (findNearest("h1")) {
        return TypographyElement.Heading1;
      }
      if (findNearest("h2")) {
        return TypographyElement.Heading2;
      }
      if (findNearest("h3")) {
        return TypographyElement.Heading3;
      }
      if (findNearest("h4")) {
        return TypographyElement.Heading4;
      }
      if (findNearest("h5")) {
        return TypographyElement.Heading5;
      }
      if (findNearest("h6")) {
        return TypographyElement.Heading6;
      }
      if (findNearest("blockquote")) {
        return TypographyElement.Blockquote;
      }
    };

    const handleColorChange = (colorType: string, colorValue: string) => {
      if (colorType === TextStyleTypes.TextColor) {
        setSelectedTextColor(colorValue);
      } else if (colorType === TextStyleTypes.BackgroundColor) {
        setSelectedBackgroundColor(colorValue);
      }
    };

    const openPopover = (type: PopoverActionType, overflow = false) => {
      setPopoverVisible(type);
      setOverflowVisible(overflow);
    };

    const closePopover = () => {
      setPopoverVisible(undefined);
    };

    const closeOverflowVisible = () => {
      setOverflowVisible(false);
    };
    const toggleOverflowVisible = () => {
      setOverflowVisible(!isOverflowVisible);
    };

    const openModal = (name: ModalNames) => () => {
      setModalName(name);
    };

    const closeModal = () => {
      setModalName(undefined);
    };

    const handleUpdateLinkAction = (link: LinkType) => {
      if (!editorRef.current) {
        return;
      }
      editorRef.current.getDoc().execCommand("Unlink", false);
      editorRef.current.execCommand("mceInsertLink", false, link);
      editorRef.current.selection.collapse();
      handleNodeChange();
      closeModal();
    };

    const handleRemoveLinkAction = () => {
      if (!editorRef.current) {
        return;
      }
      editorRef.current.execCommand("Unlink");
      closeModal();
      handleNodeChange();
    };

    const handleInsertVideo = (rawHtml: string) => {
      if (!editorRef.current) {
        return;
      }
      editorRef.current.insertContent(rawHtml);
      closeModal();
    };

    const handleInsertTable = (table: { row: number; col: number; border?: number }) => {
      // using `mceInsertContent` instead of `mceInsertTable` for custom style
      const cols = new Array(table.col + 1).join("<td><br /></td>");
      const row = `<tr>${cols}</tr>`;
      const rows = new Array(table.row + 1).join(row);
      const tableAttrs = table.border
        ? `style="border-collapse: collapse; width: 100%;" border="${table.border}"`
        : 'style="width: 100%;"';
      let colGroup = "";
      if (table.col > 1) {
        const colWidth = (100 / table.col).toFixed(2);
        const group = new Array(table.col + 1).join(`<col style="width: ${colWidth}%" />`);
        colGroup = `<colgroup>${group}</colgroup>`;
      }
      executeCommand("mceInsertContent", `<table ${tableAttrs}>${colGroup}<tbody>${rows}</tbody></table>`);
      closeModal();
    };

    const handleInsertImage = ({ images }: { images: { src: string; alt?: string }[] }) => {
      if (!editorRef.current) {
        return;
      }

      const contents = images
        .map((image) =>
          editorRef.current?.dom.createHTML("img", {
            src: image.src,
            alt: image.alt ? image.alt : null,
          })
        )
        .join("");

      if (contents !== "") {
        editorRef.current.insertContent(contents);
      }
      closeModal();
    };

    const handleUpdateImage = (image: { alt?: string; src: string }) => {
      if (!editorRef.current) {
        return;
      }
      const imgNode = findNearest("img");
      if (imgNode) {
        editorRef.current.dom.setAttribs(imgNode, {
          alt: image.alt ? image.alt : null,
          src: image.src,
        });
        editorRef.current.fire("change");
        executeCommand("mceRepaint");
        editorRef.current.selection.collapse();
      }
      closeModal();
    };

    const handleDeleteImage = () => {
      executeCommand("Delete");
      closeModal();
    };

    const handleApplyAISuggestion = (value: string) => {
      if (!editorRef.current) {
        return;
      }
      editorRef.current.setContent(value);
      editorRef.current.undoManager.add();
      editorRef.current.selection.select(editorRef.current.getBody(), true);
      editorRef.current.selection.collapse(false);
      editorRef.current.focus();
      closePopover();
      closeModal();
    };

    const handleApplyAIRewrite = (value: string) => {
      if (!editorRef.current) {
        return;
      }
      editorRef.current.selection.setContent(value);
      editorRef.current.undoManager.add();
      editorRef.current.focus();
      closePopover();
      closeModal();
    };

    const handleBeforeSetContent = (event: Events.BeforeSetContentEvent) => {
      event.content = sanitize(event.content);
    };

    const handleGetContent = (event: Events.GetContentEvent) => {
      event.content = desanitize(event.content);
    };

    const handleEditorClick = () => {
      handleNodeSelect(TextStyleTypes.SelectNode);
      closePopover();
      closeOverflowVisible();
      const nearestSpan = findNearest("span");
      let textColor: string | undefined;
      let backgroundColor: string | undefined;
      if (nearestSpan) {
        const styles = window.getComputedStyle(nearestSpan);
        textColor = styles.color;
        backgroundColor = styles.backgroundColor;
      }
      setSelectedTextColor(textColor ? textColor : blackColor);
      setSelectedBackgroundColor(backgroundColor ? backgroundColor : whiteColor);
    };

    const handleEditorChange = () => {
      if (!editorRef.current || !textareaRef.current) {
        return;
      }
      const editorContent = editorRef.current.getContent();
      const textareaContent = textareaRef.current.innerHTML;
      if (editorContent !== textareaContent) {
        onChange(editorContent);
      }
    };

    const handleSelectionChange = () => {
      if (!editorRef.current) {
        return;
      }
      const selectionContent = editorRef.current.selection.getContent();
      setSelectionContent(selectionContent);
    };

    const setTextareaAttribute = (visible: boolean) => {
      if (textareaRef.current) {
        textareaRef.current.setAttribute("aria-hidden", visible ? "false" : "true");
        textareaRef.current.style.display = visible ? "block" : "none";
      }
    };

    const setFrameContentHeight = (height: string) => `
    body {
      min-height: ${height};
    }
  `;

    const initEditor = async () => {
      const tinymce = await loadTinymce();
      if (!textareaRef.current) {
        return;
      }
      setEditorReady(false);
      await tinymce.init({
        ...defaultTinymceInitConfig,
        selector: `#${id}`,
        content_style: defaultContentStyle.concat(
          viewMode === "disabled" ? `\n${disabledContentStyle}` : "",
          setFrameContentHeight(`${textareaHeight}px`)
        ),
        height: TEXT_AREA_MIN_HEIGHT + TEXT_AREA_PAD * 2,
        max_height: isNil(maxHeight) ? defaultTinymceInitConfig.max_height : maxHeight,
      });
      editorRef.current = tinymce.EditorManager.get(id);
      if (editorRef.current) {
        editorRef.current.on("blur", handleBlur);
        editorRef.current.on("focus", handleFocus);
        editorRef.current.on("keyup change", handleEditorChange);
        editorRef.current.on("nodechange", handleNodeChange);
        editorRef.current.on("click", handleEditorClick);
        editorRef.current.on("BeforeSetContent", handleBeforeSetContent);
        editorRef.current.on("GetContent", handleGetContent);
        editorRef.current.on("FullscreenStateChanged", handleFullscreenStateChanged);
        editorRef.current.on("SelectionChange", handleSelectionChange);
        const sanitizedValue = sanitize(valueProp || "");
        editorRef.current.setContent(sanitizedValue);
        textareaRef.current.innerHTML = sanitizedValue;
        if (["disabled", "viewOnly"].includes(viewMode)) {
          editorRef.current.mode.set("readonly");
        }
      }

      setEditorReady(true);
      handleSwitchHTMLMode();
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
      handleSwitchHTMLMode();
    }, [handleSwitchHTMLMode, isCodeEditorReady, isShowHTML]);

    useEffect(() => {
      if (!isEditorReady || !editorRef.current || !textareaRef.current) {
        return;
      }
      if (valueProp !== editorRef.current.getContent()) {
        editorRef.current.setContent(valueProp);
      }
    }, [valueProp, isEditorReady]);

    const {
      bold: selectedBold,
      italic: selectedItalic,
      underline: selectedUnderline,
      orderedList: selectedOrderedList,
      unorderedList: selectedUnorderedList,
    } = textModifierState;

    const hasCounter = Boolean(showCharacterCount && maxLength);

    const count = useMemo(() => {
      if (characterCountType === "character") {
        const doc = parser.parseFromString(valueProp, "text/html");
        return doc.documentElement.textContent?.replace(/\s+/g, " ").trim().length ?? 0;
      }
      return valueProp.length;
    }, [characterCountType, valueProp]);

    useEffect(() => {
      onCharacterCountChange?.(count);
    }, [onCharacterCountChange, count]);

    return (
      <AIProvider
        content={valueProp}
        context={aiSuggestContext}
        extraContext={aiSuggestExtraContext}
        onApplySuggestion={handleApplyAISuggestion}
        onApplySuggestionRewrite={handleApplyAIRewrite}
        selectionContent={selectionContent}
      >
        <StyledRichTextEditor>
          <Labelled
            label={label}
            id={id}
            labelTooltip={labelTooltip}
            action={labelAction}
            error={error}
            requiredIndicator={requiredIndicator}
          >
            <StyledEditor
              focused={focused}
              isShowHTML={isShowHTML}
              isFullscreen={isFullscreen}
              hasCounter={hasCounter}
              $readOnly={viewMode === "disabled"}
              $viewOnly={viewMode === "viewOnly"}
              noToolbar={!displayToolbar}
            >
              <StyledToolbarWrapper>
                <FullscreenContext.Provider value={isFullscreen}>
                  {displayToolbar && (
                    <Toolbar
                      ref={toolbarRef}
                      id={id}
                      selectedBold={selectedBold}
                      selectedItalic={selectedItalic}
                      selectedUnderline={selectedUnderline}
                      selectedTypographicElement={selectedTypographicElement}
                      selectedFontSize={selectedFontSize}
                      selectedTextAligment={selectedTextAligment}
                      selectedTextColor={selectedTextColor}
                      selectedBackgroundColor={selectedBackgroundColor}
                      linkSelectionType={linkSelectionType}
                      isShowHTML={isShowHTML}
                      isReadOnly={isReadOnly}
                      isFullscreen={isFullscreen}
                      imageSelected={selectedImage !== undefined}
                      selectedOrderedList={selectedOrderedList}
                      selectedUnorderedList={selectedUnorderedList}
                      tableSelected={tableSelected}
                      hasSelection={!isEmptyString(selectionContent)}
                      exclusions={exclusions}
                      overflowVisible={isOverflowVisible}
                      onNodeSelect={handleNodeSelect}
                      executeCommand={executeCommand}
                      popoverVisible={popoverVisible}
                      onOpenPopover={openPopover}
                      onClosePopover={closePopover}
                      onToggleOverflow={toggleOverflowVisible}
                      onToggleHTML={handleToggleHTML}
                      onToggleFullscreen={toggleFullscreen}
                      onColorChange={handleColorChange}
                      openModal={openModal}
                    />
                  )}
                </FullscreenContext.Provider>
              </StyledToolbarWrapper>
              <StyledTextareaWrapper id={`richtexteditor_${id}`}>
                <StyledTextareaPlainView
                  id={id}
                  ref={textareaRef}
                  name={name}
                  defaultValue={sanitize(valueProp)}
                  onChange={(e) => onChange(e.target.value)}
                  isHidden={isCodeEditorReady}
                  disabled={isReadOnly}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                />
                {isShowHTML ? (
                  <StyledCodeEditorWrapper
                    style={{
                      height: !isFullscreen ? `${textareaHeight}px` : undefined,
                      display: !isShowHTML ? "none" : undefined,
                    }}
                  >
                    <CodeEditor
                      readOnly={isReadOnly}
                      value={valueProp}
                      onChange={onChange}
                      onLoad={handleCodeEditorLoad}
                      autoFocus
                      inRichText
                    />
                  </StyledCodeEditorWrapper>
                ) : null}
                {hasCounter ? (
                  <StyledCounter>
                    <Text as="span" alignment="end" color="slim">
                      {characterCountType === "character" ? "TEXT" : "HTML"}: {count}/{maxLength}
                    </Text>
                    <Tooltip
                      width="wide"
                      content={
                        <Text as="p">
                          Số lượng ký tự có trong đoạn văn bản.{" "}
                          <Text as="span">Lưu ý: Số lượng ký tự có thể khác số lượng từ</Text>
                        </Text>
                      }
                    >
                      <Text as="span" color="slim">
                        <Icon source={InfoCircleOutlineIcon} />
                      </Text>
                    </Tooltip>
                  </StyledCounter>
                ) : null}
              </StyledTextareaWrapper>
              {modalName === ModalNames.UpdateLink ? (
                <UpdateLinkModal
                  open
                  onClose={closeModal}
                  selectedLink={selectedLink}
                  onUpdateLink={handleUpdateLinkAction}
                  onRemoveLink={handleRemoveLinkAction}
                />
              ) : null}
              {modalName === ModalNames.InsertVideo ? (
                <InsertVideoModal open onClose={closeModal} onInsertVideo={handleInsertVideo} />
              ) : null}
              {modalName === ModalNames.InsertTable ? (
                <InsertTableModal open onClose={closeModal} onInsertTable={handleInsertTable} />
              ) : null}
              {modalName === ModalNames.InsertImage ? (
                <InsertImageModal onClose={closeModal} onInsertImage={handleInsertImage} />
              ) : null}
              {modalName === ModalNames.EditImage ? (
                <EditImageModal
                  selectedAlt={selectedImage?.alt ?? ""}
                  selectedSrc={selectedImage?.src ?? ""}
                  onClose={closeModal}
                  onUpdateImage={handleUpdateImage}
                  onDeleteImage={handleDeleteImage}
                />
              ) : null}
              {modalName === ModalNames.AISuggest ? <SuggestModal onClose={closeModal} /> : null}
              {modalName === ModalNames.AIRewriteSuggest ? <RewriteSuggestModal onClose={closeModal} /> : null}
            </StyledEditor>
          </Labelled>
        </StyledRichTextEditor>
      </AIProvider>
    );
  })
);

const StyledRichTextEditor = styled.div`
  position: relative;
`;

const StyledTextareaWrapper = styled.div`
  position: relative;
  z-index: 20;
  overflow: visible;
  background-color: ${(p) => p.theme.colors.background};
  transition-property: box-shadow, border-color;
  transition-duration: ${(p) => p.theme.motion.duration200};
  transition-timing-function: ${(p) => p.theme.motion.transformEase};
  border: none;
`;

const StyledTextareaPlainView = styled.textarea<{
  isHidden?: boolean;
}>`
  display: block;
  min-width: 100%;
  max-width: 100%;
  min-height: ${TEXT_AREA_MIN_HEIGHT + TEXT_AREA_PAD * 2}px;
  padding: ${TEXT_AREA_PAD}px ${(p) => p.theme.spacing(3)};
  border: none;
  font-family: ${(p) => p.theme.typography.fontFamilyMono};
  font-size: 0.8125rem;
  ${(p) =>
    p.isHidden &&
    css`
      display: none;
    `}
`;

const StyledCodeEditorWrapper = styled.div`
  .cm-theme {
    height: 100%;
  }

  .cm-editor,
  .cm-scroller {
    background-color: ${(p) => p.theme.colors.surface};
    border-radius: 0 0 ${(p) => p.theme.shape.borderRadius("large")} ${(p) => p.theme.shape.borderRadius("large")};
  }

  .cm-gutter {
    background-color: ${(p) => p.theme.colors.surface};
    color: ${(p) => p.theme.colors.textSubdued};
  }

  .cm-editor {
    height: 100%;
    position: relative !important;
    box-sizing: border-box;
    display: flex !important;
    flex-direction: column;
  }

  .cm-focused {
    background-color: ${(p) => p.theme.colors.surface};
  }

  .cm-theme .cm-focused {
    box-shadow: 0 0 0 ${(p) => p.theme.shape.borderWidth(1)} ${(p) => p.theme.colors.borderInteractiveFocus};
    outline: ${(p) => p.theme.shape.borderWidth(1)} solid transparent;
  }
`;

const StyledCounter = styled.div`
  background-color: ${(p) => p.theme.colors.surfaceSubdued};
  padding: ${(p) => p.theme.spacing(0.5, 2)};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${(p) => p.theme.spacing(1)};
`;

const StyledEditor = styled.div<{
  focused: boolean;
  isShowHTML?: boolean;
  isFullscreen?: boolean;
  hasCounter?: boolean;
  $readOnly?: boolean;
  $viewOnly?: boolean;
  noToolbar?: boolean;
}>`
  position: relative;
  border: ${(p) => p.theme.shape.borderBase};
  border-radius: ${(p) => p.theme.shape.borderRadius("large")};
  ${StyledTextareaWrapper}, ${StyledTextareaPlainView} {
    border-radius: 0 0 ${(p) => p.theme.shape.borderRadius("large")} ${(p) => p.theme.shape.borderRadius("large")};
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    outline-color: ${(p) => p.theme.colors.borderInteractiveFocus};
  }

  ${(p) => {
    if (p.$readOnly) {
      return css`
        ${StyledTextareaWrapper}, ${StyledTextareaPlainView} {
          background: ${p.theme.colors.surfaceDisabled};
          color: ${p.theme.colors.textDisabled};
        }
      `;
    }
    if (p.$viewOnly) {
      return css`
        ${StyledTextareaWrapper}, ${StyledTextareaPlainView} {
          border-color: ${p.theme.colors.border};
        }
      `;
    }
    return undefined;
  }}

  ${(p) =>
    p.focused &&
    css`
      border-color: transparent;
      outline-offset: ${p.theme.spacing(0.25)};
      outline: ${p.theme.spacing(0.25)} solid ${p.theme.colors.borderInteractiveFocus};
      ${StyledTextareaPlainView} {
        outline-color: ${p.theme.colors.borderInteractiveFocus};
      }
    `}

  .tox-tinymce {
    border: none;
    border-radius: 0 0 ${(p) => p.theme.shape.borderRadius("large")} ${(p) => p.theme.shape.borderRadius("large")};
  }

  ${(p) =>
    p.noToolbar &&
    css`
      ${StyledTextareaWrapper}, ${StyledTextareaPlainView},.tox-tinymce {
        border-radius: ${p.theme.shape.borderRadius("large")};
      }
    `}

  ${(p) =>
    p.isShowHTML &&
    css`
      .tox-tinymce {
        display: none;
      }
    `}

  ${(p) =>
    p.hasCounter &&
    css`
      ${StyledTextareaPlainView}, .tox-tinymce, ${StyledCodeEditorWrapper} .cm-editor, ${StyledCodeEditorWrapper} .cm-scroller {
        border-radius: 0;
      }
      ${StyledCounter} {
        border-radius: 0 0 ${p.theme.shape.borderRadius("large")} ${p.theme.shape.borderRadius("large")};
      }
    `}

  ${(p) =>
    p.isFullscreen &&
    css`
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: ${p.theme.zIndex.navigation};

      &,
      ${StyledTextareaWrapper}, ${StyledTextareaPlainView}, .tox-tinymce {
        border-radius: 0;
      }

      ${StyledCodeEditorWrapper} {
        height: calc(100vh - ${TOOLBAR_HEIGHT}px);
        .cm-editor,
        .cm-scroller {
          border-radius: 0;
        }
      }

      .tox-tinymce.tox-fullscreen {
        top: ${TOOLBAR_HEIGHT}px !important;
        height: calc(100vh - ${TOOLBAR_HEIGHT}px) !important;
      }
    `}
`;

const StyledToolbarWrapper = styled.div`
  position: relative;
  z-index: 10;
`;
