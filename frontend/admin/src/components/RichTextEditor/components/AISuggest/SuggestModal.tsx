import { Modal } from "@/ui-components";

import { suggestPropertiesMap } from "./constant";
import { useAIContext } from "./context";
import { SuggestBody } from "./SuggestBody";

type Props = {
  onClose(): void;
};

export const SuggestModal = ({ onClose }: Props) => {
  const { context } = useAIContext();

  const suggestProperties = context ? suggestPropertiesMap[context] : undefined;

  return (
    <Modal open onClose={onClose} title={suggestProperties?.title} sectioned size="fullScreen">
      <SuggestBody />
    </Modal>
  );
};
