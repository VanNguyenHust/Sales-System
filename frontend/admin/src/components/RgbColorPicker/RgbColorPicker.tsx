import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import { ColorPicker, hexToRgb, hsbToHex, hsbToRgb, rgbToHex, rgbToHsb, Tabs, TextField } from "@/ui-components";

import { PresetsColor } from "./PresetsColor";
import { blackColor, blackPresetColors, colorfullPresetColors, colorTabs, rgbToObject, whiteColor } from "./utils";

type Props = {
  textColor?: string;
  backgroundColor?: string;
  withBackground?: boolean;
  onTextChange(value: string): void;
  onBackgroundChange?(value: string): void;
  onColorPresetSelection?(): void;
  hideInput?: boolean;
};

export const RgbColorPicker = ({
  textColor = blackColor,
  backgroundColor = whiteColor,
  withBackground,
  onTextChange,
  onBackgroundChange,
  onColorPresetSelection,
  hideInput,
}: Props) => {
  const [type, setType] = useState<"text" | "background">("text");
  const [pendingText, setPendingText] = useState<string | undefined>();
  const [colorError, setColorError] = useState<string | undefined>();
  const timeout = useRef<NodeJS.Timeout>();

  const color = useMemo(() => {
    let rawColor: string;
    if (type === "text") {
      rawColor = textColor;
    } else {
      rawColor = backgroundColor;
    }
    if (rawColor.includes("#")) {
      return rawColor;
    }
    if (rawColor.includes("rgb")) {
      return hsbToHex(rgbToHsb(rgbToObject(rawColor)));
    }
    return rawColor;
  }, [backgroundColor, textColor, type]);

  const changeColor = useCallback(
    (value: string) => {
      if (type === "text") {
        onTextChange(value);
      } else {
        onBackgroundChange?.(value);
      }
    },
    [onBackgroundChange, onTextChange, type]
  );

  useEffect(() => {
    if (pendingText !== undefined) {
      timeout.current = setTimeout(() => {
        if (/^#[0-9A-F]{6}$/i.test(pendingText)) {
          changeColor(pendingText);
          setPendingText(undefined);
          setColorError(undefined);
        } else {
          setColorError("Màu không hợp lệ");
        }
      }, 300);
    }
    return () => {
      clearTimeout(timeout.current);
    };
  }, [changeColor, pendingText]);

  useEffect(() => {
    setPendingText(undefined);
    setColorError(undefined);
  }, [color]);

  const handlePresetColorSelect = (value: string) => {
    changeColor(value);
    onColorPresetSelection?.();
  };

  const hsvColor = useMemo(() => rgbToHsb(hexToRgb(color)), [color]);
  return (
    <>
      {withBackground ? (
        <Tabs
          selected={colorTabs.findIndex((t) => t.id === type)}
          tabs={colorTabs}
          onSelect={(idx) => setType(colorTabs[idx].id as any)}
          fitted
        />
      ) : null}

      <StyledPicker>
        <ColorPicker color={hsvColor} onChange={(c) => changeColor(rgbToHex(hsbToRgb(c)))} fullWidth />
        {!hideInput ? (
          <TextField
            prefix={<StyledColor style={{ backgroundColor: color }} />}
            value={pendingText ?? color.toUpperCase()}
            placeholder={color.toUpperCase()}
            onChange={setPendingText}
            error={colorError}
          />
        ) : null}
      </StyledPicker>
      <PresetsColor colors={colorfullPresetColors} onPresetClick={handlePresetColorSelect} />
      <PresetsColor colors={blackPresetColors} onPresetClick={handlePresetColorSelect} />
    </>
  );
};

const StyledPicker = styled.div`
  width: 100%;
  min-width: 240px;
  padding: ${(p) => p.theme.spacing(4)};
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing(1)};
`;

const StyledColor = styled.div`
  width: ${(p) => p.theme.spacing(5)};
  aspect-ratio: 1 / 1;
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  border: ${(p) => p.theme.shape.borderBase};
`;
