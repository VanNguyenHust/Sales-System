import { CustomForm } from "@/components/form/CustomForm";
import {
  ArrowLeftOutlined,
  InfoCircleTwoTone,
  PushpinFilled,
  PushpinOutlined,
} from "@ant-design/icons";
import styled from "@emotion/styled";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Space,
  Tooltip,
  Typography,
} from "antd";
import {
  useCreateMetafieldDefinitionMutation,
  useGetMetafieldDefinitionQuery,
  useUpdateMetafieldDefinitionMutation,
} from "./api";
import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MetafieldDefinitionOwnerResource,
  MetafieldDefinitionRequest,
  MetafieldDefinitionType,
} from "@/types/metafield";
import SelectDefinitionType from "./components/SelectDefinitionType";
import { useCustomForm } from "@/components/form/useCustomForm";
import EmptyState from "@/components/EmptyState";
import NumberConditionForm from "./components/NumberConditionForm";
import { useToast } from "@/components/Toast";
import { isClientError } from "@/client";
import { Loading } from "../admin/Loading";
import DateConditionForm from "./components/DateConditionForm";

const { Title, Text } = Typography;

export default function ManageDefinitionPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { id, ownerResource } = useParams<{
    id: string;
    ownerResource: string;
  }>();

  const isCreate = !id;
  const isEdit = !!id;

  const infoCardRef = useRef<HTMLDivElement>(null);
  const conditionCardRef = useRef<HTMLDivElement>(null);

  const { data: definition, isLoading: isLoadingDefinition } =
    useGetMetafieldDefinitionQuery(Number(id), {
      refetchOnMountOrArgChange: true,
      skip: !id,
    });

  useEffect(() => {
    if (infoCardRef.current && conditionCardRef.current) {
      const infoHeight = infoCardRef.current.getBoundingClientRect().height;
      const conditionHeight =
        conditionCardRef.current.getBoundingClientRect().height;

      const maxHeight = Math.max(infoHeight, conditionHeight);
      infoCardRef.current.style.height = `${maxHeight}px`;
      conditionCardRef.current.style.height = `${maxHeight}px`;
    }
  }, [definition]);

  const defaultValues: MetafieldDefinitionRequest = useMemo(() => {
    return {
      name: definition ? definition.name : "",
      type: definition ? definition.type : undefined,
      key: definition ? definition.key : "",
      namespace: definition ? definition.namespace : "custom",
      namespaceKey: definition
        ? `${definition.namespace}.${definition.key}`
        : "custom.",
      description: definition ? definition.description : "",
      ownerResource: ownerResource as MetafieldDefinitionOwnerResource,
      pin: definition ? definition.pin : false,
      validations:
        definition && definition.validations ? definition.validations : [],
    };
  }, [definition, ownerResource]);
  const form = useCustomForm<MetafieldDefinitionRequest>(defaultValues);

  const [createDefinition, { isLoading: isCreating }] =
    useCreateMetafieldDefinitionMutation();
  const [updateDefinition, { isLoading: isUpdating }] =
    useUpdateMetafieldDefinitionMutation();

  const handleSubmit = async () => {
    try {
      const values = form.getFieldsValue();
      const request: MetafieldDefinitionRequest = {
        ...values,
        namespace: form.getFieldValue("namespaceKey").split(".")[0],
        key: form.getFieldValue("namespaceKey").split(".")[1],
        ownerResource: ownerResource as MetafieldDefinitionOwnerResource,
        pin: values.pin,
      };

      let definitionId = id;
      if (isCreate) {
        const response = await createDefinition(request).unwrap();
        definitionId = response.id.toString();
        showToast({
          type: "success",
          message: "Tạo mới định nghĩa thành công",
        });
      } else if (isEdit) {
        await updateDefinition(request).unwrap();
        showToast({
          type: "success",
          message: "Cập nhật định nghĩa thành công",
        });
      }

      navigate(`/admin/metafields/${ownerResource}/${definitionId}`);
    } catch (error) {
      if (isClientError(error)) {
        showToast({
          type: "error",
          message: `${isCreate ? "Tạo mới" : "Cập nhật"} định nghĩa thất bại`,
          description: error.data.errors
            .map((error) => error.message)
            .join(", "),
        });
      }
    }
  };

  const cardInfoMarkup = (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            size="large"
            onClick={() => navigate("/admin/metafields")}
          ></Button>
          <Title level={4} style={{ margin: 0 }}>
            Thêm mới định nghĩa
          </Title>
        </Space>
      </Space>
      <Card ref={infoCardRef}>
        <Space direction="vertical" size={8} style={{ width: "100%" }}>
          <Title level={5}>Nội dung</Title>
          <Space direction="vertical" size={0} style={{ width: "100%" }}>
            <Text>Tên</Text>
            <Form.Item name="name">
              <Input placeholder="Nhập tên" />
            </Form.Item>
            <Text>
              Không gian tên và khóa{" "}
              <Tooltip title="Không gian tên và khóa chỉ được chứa chữ cái, số, dấu gạch dưới và dấu gạch ngang">
                <InfoCircleTwoTone />
              </Tooltip>
            </Text>
            <Form.Item name="namespaceKey">
              <Input
                placeholder="Nhập không gian tên và khóa"
                disabled={isEdit}
              />
            </Form.Item>
            <Text>Mô tả</Text>
            <Form.Item name="description">
              <Input placeholder="Nhập mô tả" />
            </Form.Item>
            <Form.Item name="type">
              <SelectDefinitionType
                onChange={(value) => {
                  form.setFieldValue("type", value);
                  form.setFieldValue("validations", []);
                }}
                disabled={isEdit}
              />
            </Form.Item>
          </Space>
        </Space>
      </Card>
    </Space>
  );

  const cardConditionMarkup = (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Space
        style={{
          width: "100%",
          justifyContent: "end",
          height: 40,
        }}
      >
        <Form.Item name="pin" style={{ marginBottom: 0 }}>
          <Button
            color="default"
            variant="text"
            icon={
              form.getFieldValue("pin") ? (
                <PushpinFilled />
              ) : (
                <PushpinOutlined />
              )
            }
            onClick={() =>
              form.setFieldValue("pin", !form.getFieldValue("pin"))
            }
          >
            <Text>{true ? "Ghim" : "Bỏ ghim"}</Text>
          </Button>
        </Form.Item>
      </Space>

      <Card ref={conditionCardRef}>
        <Title level={5}>Điều kiện</Title>
        <Form.Item name="validations">
          {form.getFieldValue("type") ? (
            <Space>
              {form.getFieldValue("type") ===
              MetafieldDefinitionType.DATE_TIME ? (
                <DateConditionForm
                  type={form.getFieldValue("type")}
                  value={form.getFieldValue("validations")}
                  onChange={(value) => form.setFieldValue("validations", value)}
                />
              ) : null}
              {form.getFieldValue("type") ==
              MetafieldDefinitionType.NUMBER_DECIMAL ? (
                <NumberConditionForm
                  type={form.getFieldValue("type")}
                  value={form.getFieldValue("validations")}
                  onChange={(value) => form.setFieldValue("validations", value)}
                />
              ) : null}
            </Space>
          ) : (
            <EmptyState description="Vui lòng chọn loại nội dung để tiến hành lựa chọn điều kiện" />
          )}
        </Form.Item>
        {form.getFieldValue("type") == MetafieldDefinitionType.BOOLEAN && (
          <EmptyState description="Không có điều kiện cho loại nội dung đúng/sai" />
        )}
        {form.getFieldValue("type") ==
          MetafieldDefinitionType.SINGLE_LINE_TEXT_FIELD && (
          <EmptyState description="Không có điều kiện cho loại nội dung văn bản một dòng" />
        )}
      </Card>
    </Space>
  );

  if (isLoadingDefinition) {
    return <Loading />;
  }

  return (
    <StyledContainer>
      <CustomForm
        form={form}
        initialValues={defaultValues}
        onFinish={handleSubmit}
      >
        <Row gutter={[16, 16]}>
          <Col xl={12} md={12} xs={24}>
            {cardInfoMarkup}
          </Col>
          <Col xl={12} md={12} xs={24}>
            {cardConditionMarkup}
          </Col>
        </Row>
        <Space style={{ width: "100%", justifyContent: "end", marginTop: 16 }}>
          <Button color="blue" variant="outlined">
            Hủy
          </Button>
          <Button
            type="primary"
            loading={isCreating || isUpdating}
            disabled={!form.isDirty}
            htmlType="submit"
          >
            Lưu
          </Button>
        </Space>
      </CustomForm>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
