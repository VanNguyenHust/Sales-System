import { useState } from "react";
import { Modal, TextField } from "@/ui-components";

type Props = {
  open: boolean;
  onClose(): void;
  onInsertVideo(text: string): void;
};

export const InsertVideoModal = ({ open, onClose, onInsertVideo }: Props) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    onInsertVideo(text);
    setText("");
  };

  const handleClose = () => {
    onClose();
    setText("");
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Chèn video"
      sectioned
      instant
      primaryAction={{
        content: "Chèn video",
        onAction: handleSubmit,
      }}
      secondaryActions={[
        {
          content: "Hủy",
          onAction: handleClose,
        },
      ]}
    >
      <TextField
        autoFocus
        value={text}
        onChange={setText}
        label="Chèn video bằng cách dán đoạn mã nhúng vào khung dưới đây:"
        placeholder="Dán đoạn mã nhúng"
        multiline={3}
        helpText="Đoạn mã nhúng thường bắt đầu bằng “<iframe ...”"
        maxHeight={350}
      />
    </Modal>
  );
};
