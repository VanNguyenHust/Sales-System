import { useState } from "react";
import { Select, Button, Space } from "antd";
import { getInfoType, MetafieldDefinitionType } from "@/types/metafield";
import styled from "@emotion/styled";
import { PlusCircleTwoTone } from "@ant-design/icons";

const options = Object.values(MetafieldDefinitionType).map((type) => {
  const info = getInfoType(type);
  return {
    value: type,
    label: info.label,
    icon: info.icon,
    labelText: info.label,
  };
});

export default function SelectDefinitionType({
  value,
  onChange,
  disabled,
}: {
  value?: MetafieldDefinitionType;
  onChange?: (value: MetafieldDefinitionType) => void;
  disabled?: boolean;
}) {
  const [selected, setSelected] = useState<MetafieldDefinitionType | undefined>(
    value
  );
  const [editing, setEditing] = useState(!value);
  const [open, setOpen] = useState(false);

  const handleSelect = (val: MetafieldDefinitionType) => {
    setSelected(val);
    setEditing(false);
    onChange?.(val);
  };

  if (!editing && selected) {
    const info = getInfoType(selected);
    const Icon = info.icon;
    return (
      <WrapperSelectedType>
        <Space>
          {Icon && <Icon style={{ fontSize: 20 }} />}
          <span>{info.label}</span>
        </Space>
        {!disabled && (
          <Button
            type="link"
            onClick={(e) => {
              e.stopPropagation();
              setEditing(true);
              setOpen(true);
            }}
            style={{ padding: 0 }}
          >
            Thay đổi
          </Button>
        )}
      </WrapperSelectedType>
    );
  }

  return (
    <Select
      style={{ height: 48 }}
      open={open}
      onOpenChange={setOpen}
      placeholder={
        <PlaceholderStyled>
          <span style={{ fontSize: 16, marginRight: 4 }}>
            <PlusCircleTwoTone />
          </span>
          Chọn loại nội dung
        </PlaceholderStyled>
      }
      suffixIcon={null}
      value={selected}
      onChange={handleSelect}
      options={options.map((opt) => ({
        value: opt.value,
        label: (
          <Space>
            {opt.icon && <opt.icon style={{ fontSize: 18 }} />}
            {opt.label}
          </Space>
        ),
        title: opt.labelText,
      }))}
    />
  );
}

const WrapperSelectedType = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  height: 48px;
`;

const PlaceholderStyled = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: #1890ff;
`;
