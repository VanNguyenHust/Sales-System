import { memo, useEffect } from "react";

import { ContextualSaveBarProps as ContextualSaveBarProps1 } from "../Frame/ContextualSaveBar";
import { useFrame } from "../Frame/useFrame";

export interface ContextualSaveBarProps extends ContextualSaveBarProps1 {}

/**
 * Dùng để thông báo chủ shop các hành động có thể khi họ tiến hành thay đổi form trên trang, thường được dùng cho các màn như tạo, chỉnh sửa đơn hàng, sản phẩm, ... để chủ shop có thể tiến hành lưu hoặc hủy hành động
 */
export const ContextualSaveBar = memo(function ContextualSaveBar({
  message,
  fullWidth,
  saveAction,
  discardAction,
  secondaryAction,
}: ContextualSaveBarProps) {
  const { setContextualSaveBar, removeContextualSaveBar } = useFrame();

  useEffect(() => {
    setContextualSaveBar({
      message,
      fullWidth,
      saveAction,
      discardAction,
      secondaryAction,
    });
  }, [message, saveAction, discardAction, secondaryAction, setContextualSaveBar, fullWidth]);

  useEffect(() => {
    return removeContextualSaveBar;
  }, [removeContextualSaveBar]);

  return null;
});
