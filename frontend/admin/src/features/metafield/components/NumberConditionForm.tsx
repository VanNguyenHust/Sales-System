import { Input, Typography, Space } from "antd";
import { ConditionProps } from "../type";
import { useMemo } from "react";
import {
  buildRulesMetafieldDefinition,
  MetafieldDefinitionType,
  MetafieldDefinitionValidation,
  MetafieldDefinitionValidationName,
} from "@/types/metafield";

const { Text } = Typography;

export default function NumberConditionForm({
  type,
  value,
  onChange,
  disabled,
}: ConditionProps) {
  const rules = useMemo(() => buildRulesMetafieldDefinition(value), [value]);

  const parseValue = (val: string | number | null | undefined) =>
    val === "" || val === null || val === undefined ? undefined : Number(val);

  const handleChangeValue = (
    valueChange: number | string | null,
    typeUpdate: MetafieldDefinitionValidationName
  ) => {
    const parsedValue = parseValue(valueChange);

    const minValue =
      typeUpdate === MetafieldDefinitionValidationName.MIN
        ? parsedValue
        : rules.min;
    const maxValue =
      typeUpdate === MetafieldDefinitionValidationName.MAX
        ? parsedValue
        : rules.max;
    const maxPrecision =
      typeUpdate === MetafieldDefinitionValidationName.MAX_PRECISION
        ? parsedValue
        : rules.maxPrecision;

    const validationsTemp: MetafieldDefinitionValidation[] = [
      {
        name: MetafieldDefinitionValidationName.MIN,
        value: minValue,
      },
      {
        name: MetafieldDefinitionValidationName.MAX,
        value: maxValue,
      },
      ...(type === MetafieldDefinitionType.NUMBER_DECIMAL
        ? [
            {
              name: MetafieldDefinitionValidationName.MAX_PRECISION,
              value: maxPrecision,
            },
          ]
        : []),
    ];
    onChange(
      validationsTemp.filter((validation) => validation.value !== undefined)
    );
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
          <Text>Giá trị tối thiểu</Text>
          <Input
            type="number"
            placeholder="0"
            style={{ width: "100%", marginTop: 8 }}
            value={rules.min as number}
            onChange={(value) =>
              handleChangeValue(
                value.target.valueAsNumber,
                MetafieldDefinitionValidationName.MIN
              )
            }
          />
        </div>
        <div>
          <Text>Giá trị tối đa</Text>
          <Input
            type="number"
            placeholder="0"
            style={{ width: "100%", marginTop: 8 }}
            value={rules.max}
            onChange={(value) =>
              handleChangeValue(
                value.target.value,
                MetafieldDefinitionValidationName.MAX
              )
            }
          />
        </div>
        <div>
          <Text>Số thập phân tối đa</Text>
          <Input
            type="number"
            placeholder="0"
            style={{ width: "100%", marginTop: 8 }}
            value={rules.maxPrecision}
            onChange={(value) =>
              handleChangeValue(
                value.target.value,
                MetafieldDefinitionValidationName.MAX_PRECISION
              )
            }
            max={9}
          />
        </div>
      </Space>
    </div>
  );
}
