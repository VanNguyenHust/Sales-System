import { useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  ChoiceList,
  type ChoiceListProps,
  Popover,
  PopoverCloseSource,
  Select2,
  Stack,
  TextField,
} from "@/ui-components";

import { filterNonNull } from "app/utils/arrays";
import { Control, lengthLessThanOrEqual, notEmptyString, submitSuccess, useCustomForm } from "app/utils/form";

import { InlineWarning } from "./InlineWarning";

export type SavedSearchActionForm = { mode: "create"; createName: string } | { mode: "update"; id: number };

export interface PopoverSaveSearchProps {
  disabled?: boolean;
  items: { id: number; name: string }[];
  loading?: boolean;
  onSubmit?: (form: SavedSearchActionForm) => Promise<boolean>;
}

type FormInput = {
  mode: SavedSearchActionForm["mode"];
  createName: string;
  updateId: string;
};

export const PopoverSaveSearch = ({ disabled, loading, items, onSubmit }: PopoverSaveSearchProps) => {
  const [open, setOpen] = useState(false);

  const { control, reset, fieldValues, submit, isSubmitting } = useCustomForm<FormInput>({
    defaultValues: {
      mode: "create",
      createName: "",
      updateId: "",
    },
    onSubmit: async ({ createName, mode, updateId }) => {
      if (onSubmit) {
        const closed = await onSubmit?.({
          mode,
          createName: mode === "create" ? createName.trim() : "",
          id: Number(updateId),
        });
        closed && setOpen(false);
      } else {
        setOpen(false);
      }
      return submitSuccess();
    },
  });

  const handleClose = () => !loading && setOpen(false);
  const handleToggle = () => {
    if (loading) {
      return;
    }
    // reset state when open
    if (!open) {
      reset();
    }
    setOpen(!open);
  };

  const disablePrimary = fieldValues.mode === "create" ? !fieldValues.createName : !fieldValues.updateId;
  return (
    <Popover
      active={open}
      onClose={handleClose}
      activator={
        <Button primary disabled={disabled || loading} onClick={handleToggle}>
          Lưu bộ lọc
        </Button>
      }
      preferredAlignment="right"
      preventCloseOnChildOverlayClick
    >
      <Card sectioned>
        <Stack vertical>
          <Control.ChoiceList
            control={control}
            name="mode"
            render={(field) => (
              <ChoiceList
                choices={filterNonNull<ChoiceListProps["choices"][number]>([
                  {
                    label: "Lưu bộ lọc mới",
                    value: "create",
                    renderChildren: (selected) =>
                      selected ? (
                        <Control.Text
                          control={control}
                          name="createName"
                          validates={[
                            lengthLessThanOrEqual(50, "Tên bộ lọc không vượt quá 50 kí tự"),
                            notEmptyString("Tên bộ lọc không được để trống"),
                          ]}
                          render={(field) => <TextField autoFocus placeholder="Nhập tên bộ lọc" {...field} />}
                        />
                      ) : null,
                  },
                  items.length
                    ? {
                        label: "Lưu vào bộ lọc đã có",
                        value: "update",
                        renderChildren: (selected) =>
                          selected ? (
                            <Control.Text
                              control={control}
                              name="updateId"
                              render={(field) => (
                                <Select2
                                  placeholder="Chọn bộ lọc"
                                  {...field}
                                  options={items.map((item) => ({
                                    label: item.name,
                                    value: `${item.id}`,
                                  }))}
                                />
                              )}
                            />
                          ) : null,
                      }
                    : null,
                ])}
                {...field}
              />
            )}
          />
          <InlineWarning message="Bộ lọc được lưu sẽ hiển thị ở dạng Tab (thẻ) ở trên danh sách" />
          <Stack distribution="trailing">
            <ButtonGroup noWrap>
              <Button primary outline onClick={handleClose} disabled={loading || isSubmitting}>
                Hủy
              </Button>
              <Button primary disabled={disablePrimary} loading={loading || isSubmitting} onClick={submit}>
                Lưu
              </Button>
            </ButtonGroup>
          </Stack>
        </Stack>
      </Card>
    </Popover>
  );
};
