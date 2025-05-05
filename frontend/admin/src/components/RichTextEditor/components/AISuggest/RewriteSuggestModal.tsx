import { Modal } from "@/ui-components";

import { suggestPropertiesMap } from "./constant";
import { useAIContext } from "./context";
import { RewriteSuggestBody } from "./RewriteSuggestBody";

type Props = {
  onClose(): void;
};

export const RewriteSuggestModal = ({ onClose }: Props) => {
  const { context } = useAIContext();

  const suggestProperties = context ? suggestPropertiesMap[context] : undefined;

  return (
    <Modal open onClose={onClose} title={suggestProperties?.title} sectioned size="fullScreen">
      <RewriteSuggestBody />
    </Modal>
  );
};
