import {
  getInfoType,
  MetafieldDefinitionAppliedResponse,
  MetafieldDefinitionType,
} from "@/types/metafield";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  Space,
  Typography,
} from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import dayjs from "dayjs";

const { Text } = Typography;

interface MetafieldProps {
  metafieldDefinitionApplied?: MetafieldDefinitionAppliedResponse;
  index: number;
  value: string | null | undefined;
  onChange: (value: string) => void;
}

const BooleanMetafieldSelect = ({ value, onChange }: MetafieldProps) => {
  return (
    <Space>
      <Radio.Group
        value={value ? value === "true" : undefined}
        onChange={(e) => onChange(e.target.value.toString())}
        buttonStyle="solid"
      >
        <Radio.Button
          value={true}
          style={{ width: "50%", textAlign: "center" }}
        >
          <Space>
            <CheckCircleOutlined />
            Đúng
          </Space>
        </Radio.Button>
        <Radio.Button
          value={false}
          style={{ width: "50%", textAlign: "center" }}
        >
          <Space>
            <CloseCircleOutlined />
            Sai
          </Space>
        </Radio.Button>
      </Radio.Group>
    </Space>
  );
};

const NumberDecimalMetafieldSelect = ({ value, onChange }: MetafieldProps) => {
  return (
    <Input
      type="number"
      placeholder="0"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

const SingleLineTextFieldMetafieldSelect = ({
  value,
  onChange,
}: MetafieldProps) => {
  return (
    <Input
      placeholder="Nhập văn bản"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

const DateTimeMetafieldSelect = ({ value, onChange }: MetafieldProps) => {
  return (
    <DatePicker
      showTime
      format="DD/MM/YYYY HH:mm:ss"
      placeholder="DD/MM/YYYY HH:mm:ss"
      value={value ? dayjs(value) : null}
      onChange={(date) => onChange(date?.format("YYYY-MM-DDTHH:mm:ss"))}
    />
  );
};

export default function MetafieldSelect({
  metafieldDefinitionApplied,
  index,
  value,
  onChange,
}: MetafieldProps) {
  return (
    <Row gutter={[16, 16]} style={{ marginTop: "10px", alignItems: "center" }}>
      <Col
        span={10}
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "left",
          height: "100%",
          justifyContent: "center",
        }}
      >
        <Text style={{ marginBottom: 0 }} strong>
          {metafieldDefinitionApplied?.metafieldDefinition.name}
        </Text>
        <Text type="secondary">
          {
            getInfoType(metafieldDefinitionApplied?.metafieldDefinition.type)
              .label
          }
        </Text>
      </Col>
      <Col span={14}>
        <StyledContainer>
          {metafieldDefinitionApplied?.metafieldDefinition.type ===
            MetafieldDefinitionType.BOOLEAN && (
            <BooleanMetafieldSelect
              index={index}
              value={value ?? undefined}
              onChange={onChange}
            />
          )}
          {metafieldDefinitionApplied?.metafieldDefinition.type ===
            MetafieldDefinitionType.NUMBER_DECIMAL && (
            <NumberDecimalMetafieldSelect
              index={index}
              value={value}
              onChange={onChange}
            />
          )}
          {metafieldDefinitionApplied?.metafieldDefinition.type ===
            MetafieldDefinitionType.SINGLE_LINE_TEXT_FIELD && (
            <SingleLineTextFieldMetafieldSelect
              index={index}
              value={value}
              onChange={onChange}
            />
          )}
          {metafieldDefinitionApplied?.metafieldDefinition.type ===
            MetafieldDefinitionType.DATE_TIME && (
            <DateTimeMetafieldSelect
              index={index}
              value={value}
              onChange={onChange}
            />
          )}
          <Button variant="link" color="danger" onClick={() => onChange("")}>
            Xóa
          </Button>
        </StyledContainer>
      </Col>
    </Row>
  );
}

const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px dashed #c5b5b5;
  border-radius: 10px;
  padding: 10px;
`;
