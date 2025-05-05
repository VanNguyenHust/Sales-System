import { ActionList } from "@/ui-components";
import { Refresh02Icon, TextAlignLeftIcon } from "@/ui-icons";

import ShortParagraph from "app/assets/icon/short-paragraph.svg?react";
import { AiSuggestionsContentModifyRequest } from "app/types";

import { useRewriteSuggest } from "./context";

type Props = {
  onChange(): void;
};

export const RewriteList = ({ onChange }: Props) => {
  const { generateData } = useRewriteSuggest();

  const actions = [
    { icon: Refresh02Icon, content: "Viết lại", action: "rephrase" },
    { icon: ShortParagraph, content: "Viết ngắn gọn", action: "simplify" },
    { icon: TextAlignLeftIcon, content: "Viết chi tiết", action: "extend" },
  ];

  return (
    <ActionList
      onActionAnyItem={onChange}
      items={actions.map(({ icon, content, action }) => ({
        icon,
        content,
        onAction: () => generateData(action as AiSuggestionsContentModifyRequest["action"]),
      }))}
    />
  );
};
