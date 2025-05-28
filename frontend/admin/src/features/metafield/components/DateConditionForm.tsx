import {
  buildRulesMetafieldDefinition,
  convertDateTimeToValue,
  MetafieldDefinitionValidation,
  MetafieldDefinitionValidationName,
} from "@/types/metafield";
import { DatePicker, Typography, Space } from "antd";
import { useMemo } from "react";
import { ConditionProps } from "../type";
import dayjs from "dayjs";

const { Text } = Typography;

export default function DateConditionForm({
  type,
  value,
  onChange,
  disabled,
}: ConditionProps) {
  const rules = useMemo(() => {
    return buildRulesMetafieldDefinition(value);
  }, [value]);
  const handleChangeValue = (
    value: string,
    fieldUpdate: MetafieldDefinitionValidationName
  ) => {
    const minDate =
      fieldUpdate === MetafieldDefinitionValidationName.MIN ? value : rules.min;
    const maxDate =
      fieldUpdate === MetafieldDefinitionValidationName.MAX ? value : rules.max;
    const validationsTemp: MetafieldDefinitionValidation[] = [
      {
        name: MetafieldDefinitionValidationName.MIN,
        value: minDate,
      },
      {
        name: MetafieldDefinitionValidationName.MAX,
        value: maxDate,
      },
    ];
    onChange(validationsTemp.filter((validation) => validation.value));
  };

  return (
    <div>
      <Text type="secondary">Giá trị phải bao gồm ngày tháng và thời gian</Text>
      <Space
        direction="vertical"
        size={16}
        style={{ width: "100%", marginTop: 16 }}
      >
        <div>
          <Text>Ngày giờ tối thiểu</Text>
          <DatePicker
            showTime
            placeholder="DD/MM/YYYY HH:mm"
            style={{ width: "100%", marginTop: 8 }}
            value={rules.min ? dayjs(rules.min) : null}
            onChange={(date) => {
              handleChangeValue(
                date ? convertDateTimeToValue(type, date.toDate()) : "",
                MetafieldDefinitionValidationName.MIN
              );
            }}
            disabled={disabled}
          />
        </div>
        <div>
          <Text>Ngày giờ tối đa</Text>
          <DatePicker
            showTime
            placeholder="DD/MM/YYYY HH:mm"
            style={{ width: "100%", marginTop: 8 }}
            value={rules.max ? dayjs(rules.max) : null}
            onChange={(date) => {
              handleChangeValue(
                date ? convertDateTimeToValue(type, date.toDate()) : "",
                MetafieldDefinitionValidationName.MAX
              );
            }}
            disabled={disabled}
          />
        </div>
      </Space>
    </div>
  );
}
