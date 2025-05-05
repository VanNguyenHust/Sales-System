import { Button as UIButton, type ButtonProps as UIButtonProps } from "@/ui-components";

import { useDateTimeSelectTextField } from "./context";

export type ButtonProps = UIButtonProps;

export function Button({ onClick, ...rest }: ButtonProps) {
  const { onTextFieldClick } = useDateTimeSelectTextField();
  const handleClick = () => {
    onClick?.();
    onTextFieldClick();
  };
  return <UIButton {...rest} onClick={handleClick} />;
}
