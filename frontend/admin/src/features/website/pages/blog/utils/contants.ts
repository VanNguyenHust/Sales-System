import { Commentable } from "app/features/website/types";
import { ChoiceItemDescriptor } from "app/types";

export const CommentableOptions: ChoiceItemDescriptor[] = [
  {
    label: "Vô hiệu hóa",
    value: Commentable.NO,
  },
  {
    label: "Chờ kiểm duyệt",
    value: Commentable.MODERATE,
  },
  {
    label: "Tự động duyệt",
    value: Commentable.YES,
  },
];
