import { ArrowLeftOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useGetMetafieldDefinitionsAppliedQuery } from "../metafield/api";
import { MetafieldDefinitionOwnerResource } from "@/types/metafield";
import { useNavigate, useParams } from "react-router-dom";
import MetafieldSelect from "../metafield/components/MetafieldSelect";
import { Loading } from "../admin/Loading";
import ProductImageUploadCard from "./components/ProductImageUploadCard";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetProductByIdQuery,
} from "./api";
import {
  InventoryInfoRequest,
  InventoryInfoResponse,
  ProductRequest,
} from "@/types/product";
import { useMemo } from "react";
import { useCustomForm } from "@/components/form/useCustomForm";
import { CustomForm } from "@/components/form/CustomForm";
import { useToast } from "@/components/Toast";
import { isClientError } from "@/client";
import { useGetLocationsQuery } from "../store/api";
import { ColumnType } from "antd/es/table";
const { Title, Text } = Typography;

export default function ManageProductPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { productId } = useParams();

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const {
    data: metafieldDefinitionsApplied,
    isLoading: isLoadingMetafields,
    isFetching: isFetchingMetafields,
  } = useGetMetafieldDefinitionsAppliedQuery({
    owner_resource: MetafieldDefinitionOwnerResource.PRODUCT,
    pin: true,
    resource_id: productId ? Number(productId) : undefined,
  });

  const {
    data: locationsWithCount,
    isLoading: isLoadingLocations,
    isFetching: isFetchingLocations,
  } = useGetLocationsQuery({});

  const {
    data: product,
    isLoading: isLoadingProduct,
    isFetching: isFetchingProduct,
  } = useGetProductByIdQuery(Number(productId), {
    skip: !productId,
  });

  const defaultValues: ProductRequest = useMemo(() => {
    return {
      name: product ? product.name : "",
      content: product ? product.content : "",
      summary: product ? product.summary : "",
      unit: product ? product.unit : "",
      tags: product ? product.tags : [],
      inventories: locationsWithCount?.locations
        ? locationsWithCount?.locations?.map((location) => ({
            storeId: location.storeId,
            productId: product?.id ?? 0,
            locationId: location.id,
            quantity:
              product?.inventories.find(
                (inventory) => inventory.locationId === location.id
              )?.quantity ?? 0,
            quantityInOrder: (() => {
              const inventory = product?.inventories.find(
                (inventory) => inventory.locationId === location.id
              );
              return (
                (inventory?.quantity ?? 0) - (inventory?.saleAvailable ?? 0)
              );
            })(),
            saleAvailable:
              product?.inventories.find(
                (inventory) => inventory.locationId === location.id
              )?.saleAvailable ?? 0,
          }))
        : [],
      images: product
        ? product.images.map((image) => ({
            ...image,
            src: image.src.toString(),
          }))
        : [],
      metafields: metafieldDefinitionsApplied
        ? metafieldDefinitionsApplied?.map((definitionApplied) => ({
            id: definitionApplied.metafield?.id ?? 0,
            key: definitionApplied.metafieldDefinition.key,
            namespace: definitionApplied.metafieldDefinition.namespace,
            value: definitionApplied.metafield?.value ?? "",
            valueType: definitionApplied.metafieldDefinition.type,
          }))
        : [],
      pricingInfo: product
        ? product.pricingInfo
        : {
            price: 0,
            compareAtPrice: 0,
            costPrice: 0,
          },
      isPublished: product ? product.isPublished : false,
      publishedOn: product ? product.publishedOn : "",
    };
  }, [product, locationsWithCount, metafieldDefinitionsApplied]);
  const form = useCustomForm<ProductRequest>(defaultValues);

  const handleFinish = async () => {
    try {
      const values = form.getFieldsValue();
      const filteredMetafields = values.metafields.filter(
        (metafield) => metafield.value !== undefined && metafield.value !== ""
      );
      values.metafields = filteredMetafields;

      let productNavigate = productId;
      if (productId) {
        await updateProduct({
          id: Number(productId),
          product: values,
        }).unwrap();
      } else {
        const response = await createProduct(values).unwrap();
        productNavigate = response.id.toString();
      }

      showToast({
        message: `${productId ? "Cập nhật" : "Thêm"} sản phẩm thành công`,
        type: "success",
      });

      navigate(`/admin/products/${productNavigate}`);
    } catch (error) {
      if (isClientError(error)) {
        showToast({
          message: error.data.errors.map((error) => error.message).join(", "),
          type: "error",
        });
      } else {
        // Handle validation errors
        const errorFields = form.getFieldsError();
        const errorMessages = errorFields
          .filter((field) => field.errors.length > 0)
          .map((field) => field.errors[0]);

        if (errorMessages.length > 0) {
          showToast({
            message: errorMessages.join(", "),
            type: "error",
          });
        }
      }
    }
  };

  const productInfoCardMarkup = (
    <Card>
      <Title level={5}>Thông tin sản phẩm</Title>
      <StyledWrapperInput>
        <Text>Tên sản phẩm</Text>
        <Form.Item name="name">
          <Input
            placeholder="Nhập tên sản phẩm(Tối đa 320 ký tự)"
            maxLength={320}
          />
        </Form.Item>
      </StyledWrapperInput>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <StyledWrapperInput>
            <Text>Đơn vị</Text>
            <Form.Item name="unit">
              <Input placeholder="Nhập đơn vị tính" maxLength={320} />
            </Form.Item>
          </StyledWrapperInput>
        </Col>
        <Col xs={24} md={12}>
          <StyledWrapperInput>
            <Text>Mô tả ngắn</Text>
            <Form.Item name="summary">
              <Input placeholder="Nhập mô tả ngắn" maxLength={320} />
            </Form.Item>
          </StyledWrapperInput>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={24}>
          <StyledWrapperInput>
            <Text>Mô tả</Text>
            <Form.Item name="content">
              <TextArea
                placeholder="Nhập mô tả sản phẩm"
                rows={4}
                maxLength={320}
              />
            </Form.Item>
          </StyledWrapperInput>
        </Col>
      </Row>
    </Card>
  );

  const pricingInfoCardMarkup = (
    <Card>
      <Title level={5}>Thông tin giá</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={8}>
          <StyledWrapperInput>
            <Text>Giá bán</Text>
            <Form.Item
              name={["pricingInfo", "price"]}
              rules={[
                { required: true, message: "Vui lòng nhập giá bán" },
                {
                  validator: async (_, value) => {
                    if (value === undefined || value === "") {
                      return Promise.reject("Vui lòng nhập giá bán");
                    }
                    const numValue = Number(value);
                    if (isNaN(numValue) || numValue < 0) {
                      return Promise.reject("Giá phải lớn hơn 0");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                type="number"
                placeholder="Nhập giá bán sản phẩm"
                min={0}
              />
            </Form.Item>
          </StyledWrapperInput>
        </Col>
        <Col xs={24} md={12} xl={8}>
          <StyledWrapperInput>
            <Text>Giá so sánh</Text>
            <Form.Item
              name={["pricingInfo", "compareAtPrice"]}
              rules={[
                {
                  validator: async (_, value) => {
                    if (value === undefined || value === "") {
                      return Promise.resolve();
                    }
                    const numValue = Number(value);
                    if (isNaN(numValue) || numValue < 0) {
                      return Promise.reject("Giá phải lớn hơn 0");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                type="number"
                placeholder="Nhập giá so sánh sản phẩm"
                min={0}
              />
            </Form.Item>
          </StyledWrapperInput>
        </Col>
        <Col xs={24} md={12} xl={8}>
          <StyledWrapperInput>
            <Text>Giá vốn</Text>
            <Form.Item
              name={["pricingInfo", "costPrice"]}
              rules={[
                {
                  validator: async (_, value) => {
                    if (value === undefined || value === "") {
                      return Promise.resolve();
                    }
                    const numValue = Number(value);
                    if (isNaN(numValue) || numValue < 0) {
                      return Promise.reject("Giá phải lớn hơn 0");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                type="number"
                placeholder="Nhập giá vốn sản phẩm"
                min={0}
              />
            </Form.Item>
          </StyledWrapperInput>
        </Col>
      </Row>
    </Card>
  );

  const metafieldInfoCardMarkup = (
    <Card>
      <Title level={5}>Metafield</Title>
      <Form.Item name="metafields" style={{ marginBottom: 0 }}>
        <div>
          {metafieldDefinitionsApplied?.map(
            (metafieldDefinitionApplied, index) => {
              return (
                <MetafieldSelect
                  key={index}
                  index={index}
                  metafieldDefinitionApplied={metafieldDefinitionApplied}
                  value={form.getFieldValue(["metafields", index, "value"])}
                  onChange={(newValue) => {
                    const currentMetafields =
                      form.getFieldValue("metafields") || [];
                    currentMetafields[index].value = newValue;

                    form.setFieldValue("metafields", currentMetafields);
                  }}
                />
              );
            }
          )}
        </div>
      </Form.Item>
    </Card>
  );

  const imagesCardMarkup = (
    <Card>
      <Title level={5}>Ảnh sản phẩm</Title>
      <Form.Item name="images">
        <ProductImageUploadCard />
      </Form.Item>
    </Card>
  );

  const columnsInventory: ColumnType<InventoryInfoRequest>[] = [
    {
      title: "Chi nhánh",
      dataIndex: "locationId",
      render: (locationId: number) => {
        const location = locationsWithCount?.locations?.find(
          (location) => location.id === locationId
        );
        return location?.name;
      },
    },
    {
      title: "Tồn kho",
      dataIndex: "quantity",
      render: (_, record, index) => {
        return (
          <Form.Item
            name={["inventories", index, "quantity"]}
            rules={[
              {
                validator: async (_, value) => {
                  const numValue = Number(value);
                  if (isNaN(numValue) || numValue < 0) {
                    return Promise.reject("Số lượng phải lớn hơn 0");
                  }
                  return Promise.resolve();
                },
              },
            ]}
            style={{ margin: 0 }}
          >
            <Input
              type="number"
              placeholder="Nhập tồn kho sản phẩm"
              min={0}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  const inventories = form.getFieldValue("inventories");
                  inventories[index].quantity = value;
                  form.setFieldValue("inventories", [...inventories]);
                }
              }}
            />
          </Form.Item>
        );
      },
    },
  ];

  if (productId) {
    columnsInventory.push(
      {
        title: "Đang giao dịch",
        render: (_, record) => {
          return <span>{record.quantityInOrder}</span>;
        },
      },
      {
        title: "Có thể bán",
        dataIndex: "saleAvailable",
        render: (_, record) => {
          return <span>{record.quantity - record.quantityInOrder}</span>;
        },
      }
    );
  }

  const inventoryCardMarkup = (
    <Card>
      <Title level={5}>Kho hàng</Title>
      <Form.Item name="inventories">
        <Table
          columns={columnsInventory}
          dataSource={form.getFieldValue("inventories")}
          pagination={false}
          rowKey="locationId"
        />
      </Form.Item>
    </Card>
  );

  const otherInfoCardMarkup = (
    <Card>
      <Title level={5}>Thông tin khác</Title>
    </Card>
  );

  if (isLoadingMetafields || isLoadingProduct || isLoadingLocations) {
    return <Loading />;
  }

  return (
    <StyledContainer>
      <CustomForm
        form={form}
        initialValues={defaultValues}
        onFinish={handleFinish}
      >
        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/admin/products")}
            />
            <Title level={4} style={{ margin: 0 }}>
              {productId ? "Cập nhật" : "Thêm"} sản phẩm
            </Title>
          </Space>
          <Space>
            <Button onClick={() => navigate("/admin/products")}>Hủy</Button>
            <Button
              type="primary"
              loading={isCreating || isUpdating}
              disabled={!form.isDirty}
              htmlType="submit"
            >
              {productId ? "Lưu" : "Thêm sản phẩm"}
            </Button>
          </Space>
        </Space>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={15}>
            <Space size={16} direction="vertical" style={{ width: "100%" }}>
              {productInfoCardMarkup}
              {pricingInfoCardMarkup}
              {inventoryCardMarkup}
              {metafieldInfoCardMarkup}
            </Space>
          </Col>
          <Col xs={24} md={9}>
            <Space size={16} direction="vertical" style={{ width: "100%" }}>
              {imagesCardMarkup}
              {otherInfoCardMarkup}
            </Space>
          </Col>
        </Row>

        <StyledButtonBottom>
          <Button
            type="primary"
            htmlType="submit"
            loading={isCreating || isUpdating}
            disabled={!form.isDirty}
          >
            {productId ? "Lưu" : "Thêm sản phẩm"}
          </Button>
        </StyledButtonBottom>
      </CustomForm>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 24px;
`;

const StyledWrapperInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StyledButtonBottom = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;
