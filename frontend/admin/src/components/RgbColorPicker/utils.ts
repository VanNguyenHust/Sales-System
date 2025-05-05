import type { RGBAColor, TabsProps } from "@/ui-components";

export const colorfullPresetColors = ["#FF2A00", "#FF8000", "#FFFF00", "#80FF00", "#00AAFF", "#2B00FF", "#FF00FF"];
export const blackPresetColors = ["#000000", "#404040", "#808080", "#B3B3B3", "#CCCCCC", "#E6E6E6", "#FFFFFF"];
export const blackColor = "#000000";
export const whiteColor = "#FFFFFF";

export function rgbToObject(color: string): RGBAColor {
  const colorMatch = color.match(/\(([^)]+)\)/);

  if (!colorMatch) {
    return { red: 0, green: 0, blue: 0, alpha: 0 };
  }

  const [red, green, blue, alpha] = colorMatch[1].split(",");
  const objColor = {
    red: parseInt(red, 10),
    green: parseInt(green, 10),
    blue: parseInt(blue, 10),
    alpha: parseInt(alpha, 10) || 1,
  };
  return objColor;
}

export const colorTabs: TabsProps["tabs"] = [
  {
    id: "text",
    content: "Màu chữ",
  },
  {
    id: "background",
    content: "Màu nền",
  },
];
