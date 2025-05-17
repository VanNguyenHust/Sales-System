import { Form, FormInstance, FormProps } from "antd";
import { ReactNode } from "react";
import { useCustomForm, CustomFormInstance } from "./useCustomForm";

interface CustomFormProps<T extends Record<string, any>>
  extends Omit<FormProps<T>, "form"> {
  initialValues?: T;
  form?: FormInstance<T>;
  children?: ReactNode;
  onFormChange?: (form: CustomFormInstance<T>) => void;
}

export function CustomForm<T extends Record<string, any>>({
  initialValues,
  form: externalForm,
  children,
  onValuesChange,
  onFormChange,
  ...props
}: CustomFormProps<T>) {
  const customForm = useCustomForm<T>(initialValues, externalForm);

  const handleValuesChange = (changedValues: Partial<T>, allValues: T) => {
    customForm.updateDirty(allValues);
    onValuesChange?.(changedValues, allValues);
    onFormChange?.(customForm);
  };

  return (
    <Form
      {...props}
      form={customForm}
      initialValues={initialValues}
      onValuesChange={handleValuesChange}
    >
      {children}
    </Form>
  );
}
