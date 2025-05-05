import { useEffect, useId, useRef, useState } from "react";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { html } from "@codemirror/lang-html";
import { lezer } from "@codemirror/lang-lezer";
import { defaultHighlightStyle, language, syntaxHighlighting } from "@codemirror/language";
import { searchKeymap } from "@codemirror/search";
import { Compartment, EditorState, type Extension } from "@codemirror/state";
import { drawSelection, EditorView, keymap, lineNumbers, placeholder } from "@codemirror/view";
import styled from "@emotion/styled";
import { Labelled, type TextFieldProps } from "@/ui-components";

type Props = Pick<
  TextFieldProps,
  "id" | "label" | "labelAction" | "labelTooltip" | "error" | "requiredIndicator" | "placeholder"
> & {
  value?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
  height?: number;
  maxHeight?: number;
  onChange?(value: string): void;
  onLoad?(): void;
  inRichText?: boolean;
  lang?: "html" | "lezer";
};

const extensions: Extension = [
  lineNumbers(),
  history(),
  drawSelection(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  keymap.of([...defaultKeymap, ...searchKeymap, ...historyKeymap, indentWithTab]),
  EditorView.lineWrapping,
];

const readOnlyCompartment = new Compartment();
const placeholderCompartment = new Compartment();
const languageCompartment = new Compartment();

export const CodeEditor = ({
  id: idProp,
  value,
  onChange,
  readOnly: readonly = false,
  autoFocus,
  height: heightProp,
  maxHeight,
  onLoad,
  inRichText,
  label,
  labelAction,
  labelTooltip,
  requiredIndicator,
  placeholder: placeholderProp,
  error,
  lang,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView>();
  const [height, setHeight] = useState<number | undefined>();
  const autoId = useId();
  const id = idProp ?? autoId;

  const onChangeRef = useRef<Props["onChange"]>();
  const onLoadRef = useRef<Props["onLoad"]>();

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onLoadRef.current = onLoad;
  }, [onLoad]);

  useEffect(() => {
    if (ref.current) {
      view.current = new EditorView({
        extensions: [
          extensions,
          readOnlyCompartment.of(EditorState.readOnly.of(false)),
          placeholderCompartment.of(placeholder("")),
          languageCompartment.of(html()),
          EditorView.updateListener.of((viewUpdate) => {
            if (viewUpdate.docChanged) {
              const doc = viewUpdate.state.doc;
              const value = doc.toString();
              onChangeRef.current?.(value);
            }
          }),
        ],
        parent: ref.current,
      });
      onLoadRef.current?.();
    }

    return () => {
      if (view.current) {
        view.current.destroy();
        view.current = undefined;
      }
    };
  }, []);

  useEffect(() => {
    if (view.current) {
      const editorValue = view.current.state.doc.toString();
      if (value !== editorValue) {
        view.current.dispatch({
          changes: {
            from: 0,
            to: editorValue.length,
            insert: value || "",
          },
        });
      }
    }
  }, [value]);

  useEffect(() => {
    if (view.current) {
      const stateLanguage = view.current.state.facet(language);
      if (stateLanguage?.name !== lang) {
        view.current.dispatch({
          effects: languageCompartment.reconfigure(lang === "lezer" ? lezer() : html()),
        });
      }
    }
  }, [lang]);

  useEffect(() => {
    if (view.current) {
      const currentReadOnly = view.current.state.readOnly;
      if (readonly !== currentReadOnly) {
        view.current.dispatch({
          effects: readOnlyCompartment.reconfigure(EditorState.readOnly.of(readonly)),
        });
      }
    }
  }, [readonly]);

  useEffect(() => {
    if (view.current) {
      view.current.dispatch({
        effects: placeholderCompartment.reconfigure(placeholder(placeholderProp ?? "")),
      });
    }
  }, [placeholderProp]);

  useEffect(() => {
    if (autoFocus && view.current) {
      view.current.focus();
    }
  }, [autoFocus, view]);

  useEffect(() => {
    if (view.current) {
      if (!maxHeight) {
        return;
      }
      const pad = 2;
      setHeight(Math.max(150 + pad, Math.min(view.current.contentHeight + pad, maxHeight + pad)));
    }
  }, [maxHeight, value]);

  if (inRichText) {
    return <div ref={ref} className="cm-theme" style={heightProp ? { height: heightProp } : undefined} />;
  }

  return (
    <Labelled
      id={id}
      label={label}
      labelTooltip={labelTooltip}
      error={error}
      action={labelAction}
      requiredIndicator={requiredIndicator}
    >
      <StyledCodeEditor ref={ref} style={{ height: heightProp ?? height }} error={!!error} />
    </Labelled>
  );
};

const StyledCodeEditor = styled.div<{
  error?: boolean;
}>`
  .cm-content,
  .cm-gutter {
    min-height: 150px;
  }
  .cm-editor {
    height: 100%;
  }

  .cm-editor,
  .cm-scroller {
    background-color: ${(p) => p.theme.colors.surface};
    border-radius: ${(p) => p.theme.shape.borderRadius("large")};
  }
  .cm-gutter {
    background-color: ${(p) => p.theme.colors.surface};
    color: ${(p) => p.theme.colors.textSubdued};
  }

  .cm-editor {
    border: ${(p) => p.theme.shape.borderWidth(1)} solid
      ${(p) => (p.error ? p.theme.colors.borderCritical : p.theme.colors.border)};
  }

  .cm-focused {
    box-shadow: 0 0 0 ${(p) => p.theme.shape.borderWidth(1)} ${(p) => p.theme.colors.borderInteractiveFocus};
    outline: ${(p) => p.theme.shape.borderWidth(1)} solid transparent;
    border-color: transparent;
  }
`;
