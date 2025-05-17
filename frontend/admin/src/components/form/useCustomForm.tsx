import { Form, FormInstance } from "antd";
import { isEqual } from "lodash-es";
import { useEffect, useRef, useState } from "react";

export interface CustomFormInstance<T extends Record<string, any>>
  extends FormInstance<T> {
  isDirty: boolean;
  isDirtyValue: (fieldName: keyof T) => boolean;
  updateDirty: (values: T) => void;
}

export function useCustomForm<T extends Record<string, any>>(
  initialValues?: T,
  externalForm?: FormInstance<T>
): CustomFormInstance<T> {
  const [form] = Form.useForm<T>();
  const formInstance = externalForm ?? form;

  const initialValuesRef = useRef(initialValues ?? {});
  const [isDirty, setIsDirty] = useState(false);
  const [dirtyFields, setDirtyFields] = useState<Record<string, boolean>>({});

  const checkDirty = (currentValues: T) => {
    const initial = initialValuesRef.current as T;
    const hasChanges = !isEqual(currentValues, initial);
    setIsDirty(hasChanges);

    const changedFields: Record<string, boolean> = {};
    for (const key of Object.keys(currentValues)) {
      changedFields[key] = !isEqual(currentValues[key], initial[key]);
    }
    setDirtyFields(changedFields);
  };

  const formValues = Form.useWatch([], formInstance);

  useEffect(() => {
    initialValuesRef.current = initialValues ?? {};
    // Reset dirty state when initialValues change
    const currentValues = formInstance.getFieldsValue(true);
    checkDirty(currentValues);
  }, [initialValues, formInstance]);

  useEffect(() => {
    if (formValues) {
      checkDirty(formValues as T);
    }
  }, [formValues]);

  const customForm = {
    ...formInstance,
    isDirty,
    isDirtyValue: (fieldName: keyof T) =>
      dirtyFields[fieldName as string] || false,
    updateDirty: (values: T) => checkDirty(values),
  };

  return customForm;
}
