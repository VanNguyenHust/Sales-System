import { memo } from "react";

import { useUniqueId } from "../../utils/uniqueId";
import { useDeepEffect } from "../../utils/useDeepEffect";
import { ToastProps } from "../Frame/Toast";
import { useFrame } from "../Frame/useFrame";

/**
 * Toast là một thông báo không gây gián đoạn xuất hiện ở cuối giao diện để cung cấp phản hồi nhanh chóng, nhanh chóng về kết quả của một hành động
 *
 * Sử dụng để truyền đạt xác nhận chung hoặc các hành động không quan trọng. Ví dụ: bạn có thể hiển thị thông báo chúc mừng để thông báo cho người bán rằng hành động gần đây của họ đã thành công.
 */
export const Toast = memo(function Toast(props: ToastProps) {
  const id = useUniqueId("Toast");
  const { showToast, hideToast } = useFrame();

  useDeepEffect(() => {
    showToast({ id, ...props });

    return () => {
      hideToast({ id });
    };
  }, [props]);

  return null;
});
