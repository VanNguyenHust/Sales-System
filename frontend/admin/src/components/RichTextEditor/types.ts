import type { Editor } from "@sapo/tinymce";
import { type IconSource, type PopoverProps } from "@/ui-components";
import { TextAlignCenterIcon, TextAlignJustifyIcon, TextAlignLeftIcon, TextAlignRightIcon } from "@/ui-icons";

import { ResizedImageType } from "app/utils/url";

export enum LinkSelectionType {
  Insert = "insert",
  Edit = "edit",
}

export type GroupAction = {
  key: string;
  items?: Action[];
};

export type Action = {
  label: string;
  content?: string;
  icon?: IconSource;
  pressed?: boolean;
  disabled?: boolean;
  magic?: boolean;
  popover?: PopoverAction;
  onClick?(): void;
};

export enum PopoverActionType {
  Color = "Color",
  Formatting = "Formatting",
  FontSize = "FontSize",
  Aligment = "Aligment",
  Table = "Table",
  AISuggest = "AISuggest",
  AIRewriteList = "AIRewriteList",
  AIRewrite = "AIRewrite",
}

export type PopoverAction = Pick<
  PopoverProps,
  "fullHeight" | "active" | "fluidContent" | "children" | "preferredAlignment"
> & {
  key: PopoverActionType;
};

export enum TextModifierTypes {
  Bold = "bold",
  Italic = "italic",
  Underline = "underline",
  OrderedList = "insertOrderedList",
  UnorderedList = "insertUnorderedList",
}

export enum TextStyleTypes {
  Bold = "bold",
  Italic = "italic",
  Underline = "underline",
  OrderedList = "insertOrderedList",
  UnorderedList = "insertUnorderedList",
  SelectNode = "selectNode",
  TextColor = "ForeColor",
  BackgroundColor = "BackColor",
}

export enum TextAligmentTypes {
  JustifyLeft = "justifyleft",
  JustifyCenter = "justifycenter",
  JustifyRight = "justifyright",
  JustifyFull = "justifyfull",
}

export const textAligmentList = [
  {
    label: "Căn trái",
    value: "left",
    command: "justifyleft",
    icon: TextAlignLeftIcon,
  },
  {
    label: "Căn giữa",
    value: "center",
    command: "justifycenter",
    icon: TextAlignCenterIcon,
  },
  {
    label: "Căn phải",
    value: "right",
    command: "justifyright",
    icon: TextAlignRightIcon,
  },
  {
    label: "Căn đều",
    value: "full",
    command: "justifyfull",
    icon: TextAlignJustifyIcon,
  },
];

export type ExecCommandArgs = NonNullable<Parameters<Editor["execCommand"]>[3]>;

export enum TypographyElement {
  Paragraph = "p",
  Heading1 = "h1",
  Heading2 = "h2",
  Heading3 = "h3",
  Heading4 = "h4",
  Heading5 = "h5",
  Heading6 = "h6",
  Blockquote = "blockquote",
}

export const headingList = [
  {
    key: TypographyElement.Paragraph,
    label: "Đoạn",
  },
  {
    key: TypographyElement.Heading1,
    label: "Tiêu đề 1",
  },
  {
    key: TypographyElement.Heading2,
    label: "Tiêu đề 2",
  },
  {
    key: TypographyElement.Heading3,
    label: "Tiêu đề 3",
  },
  {
    key: TypographyElement.Heading4,
    label: "Tiêu đề 4",
  },
  {
    key: TypographyElement.Heading5,
    label: "Tiêu đề 5",
  },
  {
    key: TypographyElement.Heading6,
    label: "Tiêu đề 6",
  },
  {
    key: TypographyElement.Blockquote,
    label: "Trích dẫn",
  },
];

export const fontSizeList = [
  {
    value: "8px",
    label: "8",
  },
  {
    value: "9px",
    label: "9",
  },
  {
    value: "10px",
    label: "10",
  },
  {
    value: "11px",
    label: "11",
  },
  {
    value: "12px",
    label: "12",
  },
  {
    value: "14px",
    label: "14",
  },
  {
    value: "16px",
    label: "16",
  },
  {
    value: "18px",
    label: "18",
  },
  {
    value: "20px",
    label: "20",
  },
  {
    value: "22px",
    label: "22",
  },
  {
    value: "24px",
    label: "24",
  },
  {
    value: "26px",
    label: "26",
  },
  {
    value: "28px",
    label: "28",
  },
  {
    value: "30px",
    label: "30",
  },
  {
    value: "36px",
    label: "36",
  },
  {
    value: "48px",
    label: "48",
  },
  {
    value: "72px",
    label: "72",
  },
];

export const blackColor = "#000000";
export const whiteColor = "#FFFFFF";

export enum LinkSelectionTypes {
  Insert = "Insert",
  Edit = "Edit",
  Empty = "Empty",
}

export enum ModalNames {
  UpdateLink = "UpdateLink",
  EditImage = "EditImage",
  InsertImage = "InsertImage",
  InsertVideo = "InsertVideo",
  InsertTable = "InsertTable",
  AISuggest = "AISuggest",
  AIRewriteSuggest = "AIRewriteSuggest",
}

export type LinkType = {
  href: string;
  target: LinkTarget;
  title: string;
};

export enum LinkTarget {
  External = "_blank",
  Internal = "",
}

export const TEXT_AREA_PAD = 8;
export const TEXT_AREA_MIN_HEIGHT = 150;
export const TOOLBAR_HEIGHT = 40;

export const imageOptions: { label: string; value: ResizedImageType | "" }[] = [
  {
    label: "Original",
    value: "",
  },
  {
    label: "Pico (16x16)",
    value: "pico",
  },
  {
    label: "Icon (32x32)",
    value: "icon",
  },
  {
    label: "Thumb (50x50)",
    value: "thumb",
  },
  {
    label: "Small (100x100)",
    value: "small",
  },
  {
    label: "Compact (160x160)",
    value: "compact",
  },
  {
    label: "Medium (240x240)",
    value: "medium",
  },
  {
    label: "Large (480x480)",
    value: "large",
  },
  {
    label: "Grande (600x600)",
    value: "grande",
  },
  {
    label: "1024x1024",
    value: "1024x1024",
  },
  {
    label: "2048x2048",
    value: "2048x2048",
  },
];

export type ExclusionType =
  | "font-size"
  | "fullscreen"
  | "video"
  | "image"
  | "table"
  | "view-source"
  | "clear-formatting";
