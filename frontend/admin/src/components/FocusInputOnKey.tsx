import { useRef } from "react";
import { useEventListener } from "@/ui-components";

type Props = {
  keyboardKey: string;
  disabled?: boolean;
  children: React.ReactNode;
};

const KEYBOARD_FOCUSABLE_INPUT_SELECTORS =
  "input:not([type=hidden]):not(:disabled),select:not(:disabled),textarea:not(:disabled)";

/**
 * Tìm và focus vào input/select khi `keyboardKey` được press
 *
 * Chỉ tìm input/select không bị disable
 */
export function FocusInputOnKey({ keyboardKey, disabled, children }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEventListener("keydown", (event) => {
    if (disabled || event.key !== keyboardKey) {
      return;
    }
    event.preventDefault();
    const input = ref.current?.querySelector(KEYBOARD_FOCUSABLE_INPUT_SELECTORS) as
      | HTMLInputElement
      | HTMLSelectElement;
    if (input) {
      input.focus();
    }
  });

  return <span ref={ref}>{children}</span>;
}
