import { useState } from "react";
import { Button, FormLayout, Modal, Select2, TextField } from "@/ui-components";

import { LinkTarget, LinkType } from "../types";

type Props = {
  open: boolean;
  selectedLink?: LinkType;
  onClose(): void;
  onUpdateLink(link: LinkType): void;
  onRemoveLink(): void;
};

const defaultLink: LinkType = {
  href: "",
  target: LinkTarget.Internal,
  title: "",
};

export const UpdateLinkModal = ({
  open,
  selectedLink: selectedLinkProp,
  onClose,
  onRemoveLink,
  onUpdateLink,
}: Props) => {
  const [selectedLink, setSelectedLink] = useState<LinkType>(selectedLinkProp || defaultLink);

  const handleSubmit = () => {
    onUpdateLink(selectedLink);
  };

  const updateHref = (value: string) => {
    setSelectedLink((state) => ({
      ...state,
      href: value,
    }));
  };

  const updateTarget = (value: string) => {
    setSelectedLink((state) => ({
      ...state,
      target: value as LinkTarget,
    }));
  };

  const updateTitle = (value: string) => {
    setSelectedLink((state) => ({
      ...state,
      title: value,
    }));
  };

  const title = selectedLinkProp ? "Sửa liên kết" : "Chèn liên kết";
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      sectioned
      instant
      primaryAction={{
        content: title,
        onAction: handleSubmit,
      }}
      secondaryActions={[
        {
          content: "Hủy",
          onAction: onClose,
        },
      ]}
      footer={
        selectedLinkProp ? (
          <Button destructive onClick={onRemoveLink}>
            Xóa liên kết
          </Button>
        ) : undefined
      }
    >
      <FormLayout>
        <FormLayout.Group>
          <TextField
            label="Liên kết tới"
            placeholder="http://"
            helpText="http:// là bắt buộc cho liên kết ngoài"
            value={selectedLink.href}
            onChange={updateHref}
          />
          <Select2
            label="Mở link với"
            options={[
              {
                label: "Trên cùng cửa sổ",
                value: LinkTarget.Internal,
              },
              {
                label: "Mở cửa sổ mới",
                value: LinkTarget.External,
              },
            ]}
            value={selectedLink.target}
            onChange={updateTarget}
          />
        </FormLayout.Group>
        <TextField
          label="Tiêu đề liên kết"
          helpText="Được sử dụng cho SEO và accessibility"
          value={selectedLink.title}
          onChange={updateTitle}
        />
      </FormLayout>
    </Modal>
  );
};
