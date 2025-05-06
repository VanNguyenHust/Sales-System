import { Card, Col, Input, Row, Select, Table } from "antd";
import { columnsStore, FilterStoresRequest } from "../../types/stores";
import { useGetStoresQuery } from "../../api";
import { Loading } from "../../components/Loading";
import { useStoreFilter } from "./hooks/useStoreFilter";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../utils/useDebounce";
import { provinces } from "../../constants/province";
import { Typography } from "antd";
const { Text } = Typography;

export default function ManageListStorePage() {
  const navigate = useNavigate();
  const {
    filter,
    query,
    page,
    limit,
    changeFilter,
    changeQuery,
    changePage,
    changePerPage,
  } = useStoreFilter();

  const debouncedQuery = useDebounce(query, 500);

  const apiParams: FilterStoresRequest = {
    query: debouncedQuery,
    status: filter.status !== "" ? parseInt(filter.status) : undefined,
    province: filter.province,
    page,
    limit,
  };

  const {
    data: storesResponse,
    isLoading,
    isFetching,
  } = useGetStoresQuery(apiParams, { refetchOnMountOrArgChange: true });

  const { stores = [], count = 0 } = storesResponse || {};

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Col>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={16}>
          <div>
            <Text strong>Từ khóa tìm kiếm</Text>
            <Input.Search
              placeholder="Nhập tên cửa hàng, email, số điện thoại hoặc chủ cửa hàng"
              allowClear
              onSearch={(value) => {
                changeQuery(value);
              }}
              onChange={(e) => {
                changeQuery(e.target.value);
              }}
              value={query}
              style={{ width: "100%", marginTop: 4 }}
            />
          </div>
        </Col>
        <Col xs={24} md={4}>
          <div>
            <Text strong>Trạng thái</Text>
            <Select
              placeholder="Trạng thái"
              allowClear
              onChange={(value) => {
                changeFilter({ ...filter, status: value });
              }}
              value={filter.status}
              style={{ width: "100%", marginTop: 4 }}
            >
              <Select.Option key={""} value={""}>
                Tất cả
              </Select.Option>
              <Select.Option key={0} value={"0"}>
                Chưa kích hoạt
              </Select.Option>
              <Select.Option key={1} value={"1"}>
                Đang hoạt động
              </Select.Option>
              <Select.Option key={2} value={"2"}>
                Đã hết hạn
              </Select.Option>
            </Select>
          </div>
        </Col>
        <Col xs={24} md={4}>
          <div>
            <Text strong>Tỉnh thành</Text>
            <Select
              placeholder="Tỉnh thành"
              allowClear
              onChange={(value) => {
                changeFilter({ ...filter, province: value });
              }}
              value={filter.province}
              style={{ width: "100%", marginTop: 4 }}
            >
              {provinces.map((province) => (
                <Select.Option key={province.key} value={province.key}>
                  {province.label}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Col>
      </Row>
      <Card title="Danh sách cửa hàng">
        <Table
          columns={columnsStore}
          dataSource={stores.map((store) => ({
            ...store,
            key: store.id,
          }))}
          loading={isFetching}
          pagination={{
            current: page,
            pageSize: limit,
            onChange: (page, pageSize) => {
              changePage(page);
              changePerPage(pageSize);
            },
            total: count,
            showTotal: (total) => `Tổng ${total} cửa hàng`,
          }}
          onRow={(record) => ({
            onClick: () => {
              navigate(`/stores/${record.id}`);
            },
          })}
        />
      </Card>
    </Col>
  );
}
