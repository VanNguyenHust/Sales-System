import { useState } from "react";
import { FormLayout, Modal, TextField } from "@/ui-components";

type TableType = {
  row: number;
  col: number;
  border?: number;
};

type Props = {
  open: boolean;
  onClose(): void;
  onInsertTable(table: TableType): void;
};

const defaultTable: TableType = {
  row: 2,
  col: 3,
  border: 1,
};

export const InsertTableModal = ({ open, onClose, onInsertTable }: Props) => {
  const [table, setTable] = useState<TableType>(defaultTable);

  const updateRow = (value: string) => {
    setTable((table) => ({
      ...table,
      row: Number(value),
    }));
  };

  const updateCol = (value: string) => {
    setTable((table) => ({
      ...table,
      col: Number(value),
    }));
  };

  const updateBorder = (value: string) => {
    setTable((table) => ({
      ...table,
      border: value ? Number(value) : undefined,
    }));
  };

  const handleSubmit = () => {
    onInsertTable(table);
    setTable(defaultTable);
  };

  const handleClose = () => {
    onClose();
    setTable(defaultTable);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Chèn bảng"
      size="small"
      sectioned
      instant
      primaryAction={{
        content: "Chèn bảng",
        onAction: handleSubmit,
      }}
      secondaryActions={[
        {
          content: "Hủy",
          onAction: handleClose,
        },
      ]}
    >
      <FormLayout>
        <FormLayout.Group>
          <TextField
            type="integer"
            label="Hàng"
            value={`${table.row}`}
            onChange={updateRow}
            min="1"
            selectTextOnFocus
          />
          <TextField type="integer" label="Cột" value={`${table.col}`} onChange={updateCol} min="1" selectTextOnFocus />
        </FormLayout.Group>
        <TextField
          type="integer"
          label="Kích thước đường viền"
          placeholder="Nhập kích thước đường viền"
          value={table.border ? `${table.border}` : ""}
          onChange={updateBorder}
          selectTextOnFocus
        />
      </FormLayout>
    </Modal>
  );
};
