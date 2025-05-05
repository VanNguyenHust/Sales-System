import { TextField, type TextFieldProps } from "@/ui-components";

type Props = {
  value?: number;
  onChange(value: number): void;
  style?: React.CSSProperties;
  type?: TextFieldProps["type"];
  positive?: boolean;
  hint?: string;
} & Omit<TextFieldProps, "value" | "onChange" | "type">;

const NumberInputComponent = ({ value = 0, onChange, style, type = "number", positive, hint, ...props }: Props) => {
  return (
    <div style={style}>
      <TextField
        {...props}
        type={type}
        value={hint ? "" : value.toString()}
        onChange={(value) => {
          const numberValue = Number(value.replace(/,/g, ""));
          if (positive) {
            if (numberValue < 0) return;
          }
          onChange(numberValue);
        }}
        placeholder={hint ?? props.placeholder}
      />
    </div>
  );
};

export default NumberInputComponent;
