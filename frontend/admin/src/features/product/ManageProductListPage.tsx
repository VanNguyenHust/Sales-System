import { PlusCircleOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Button, Card, Space, Table, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "./api";
import { Loading } from "../admin/Loading";
import { ProductResponse } from "@/types/product";
import { ColumnType } from "antd/es/table";
const { Title } = Typography;

export default function ManageProductListPage() {
  const navigate = useNavigate();

  const {
    data: productsWithCount,
    isLoading: isLoadingProducts,
    isFetching: isFetchingProducts,
  } = useGetProductsQuery({
    query: "",
  });

  const { products, count } = productsWithCount || {
    products: [],
    count: 0,
  };

  if (isLoadingProducts) {
    return <Loading />;
  }

  const columns: ColumnType<ProductResponse>[] = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
    },
    {
      title: "Tồn kho",
      render: (_, record) => {
        return (
          <span>
            {record.inventories?.reduce(
              (acc, inventory) => acc + inventory.quantity,
              0
            )}
          </span>
        );
      },
    },
    {
      title: "Có thể bán",
      render: (_, record) => {
        return (
          <span>
            {record.inventories?.reduce(
              (acc, inventory) => acc + inventory.saleAvailable,
              0
            )}
          </span>
        );
      },
    },
    {
      title: "Giá bán",
      dataIndex: ["pricingInfo", "price"],
    },
    {
      title: "Giá so sánh",
      dataIndex: ["pricingInfo", "compareAtPrice"],
    },
    {
      title: "Giá vốn",
      dataIndex: ["pricingInfo", "costPrice"],
    },
    {
      title: "Ngày khởi tạo",
      dataIndex: "createdOn",
    },
  ];

  const productTableMarkup = (
    <Table
      dataSource={products}
      columns={columns}
      loading={isFetchingProducts}
      pagination={{
        total: count,
        pageSize: 10,
        current: 1,
      }}
      onRow={(record) => ({
        onClick: () => navigate(`/admin/products/${record.id}`),
      })}
      style={{
        marginTop: 16,
      }}
    />
  );

  return (
    <StyledContainer>
      <Card>
        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
            alignItems: "start",
          }}
        >
          <Title level={5}>Danh sách sản phẩm</Title>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => navigate(`/admin/products/create`)}
          >
            Thêm sản phẩm
          </Button>
        </Space>
        {productTableMarkup}
      </Card>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
