import styled from "@emotion/styled";
import {
  Button,
  Card,
  Col,
  Divider,
  Row,
  Space,
  Table,
  Tabs,
  Tooltip,
  Typography,
} from "antd";
import {
  useCountMetafieldDefinitionQuery,
  useDefinitionCountByResourceQuery,
  useGetMetafieldDefinitionsQuery,
  useUpdateMetafieldDefinitionMutation,
} from "./api";
import { Loading } from "../admin/Loading";
import { getOwnerResourceName, MetafieldDefinitionSources } from "./constants";
import type { ColumnsType } from "antd/es/table";
import {
  getInfoType,
  MetafieldDefinitionOwnerResource,
  MetafieldDefinitionResponse,
} from "@/types/metafield";
import { ReactElement, useEffect, useMemo, useState } from "react";
import {
  PlusCircleOutlined,
  PushpinFilled,
  PushpinOutlined,
} from "@ant-design/icons";
import { TabType } from "./type";
import { useMetafieldDefinitionFilters } from "./hooks/useMetafieldDefinitionFilters";
import { PaginationFilter } from "@/types/common";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/Toast";
import { isClientError } from "@/client";

interface TableItem {
  key: MetafieldDefinitionOwnerResource;
  icon: ReactElement;
  info: string;
  value: number;
}

const LIMIT = 50;

const { Title, Text } = Typography;

export default function ManageListDefinitionPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [ownerResource, setOwnerResource] =
    useState<MetafieldDefinitionOwnerResource>();

  const [updateDefinition] = useUpdateMetafieldDefinitionMutation();

  const { page, activeTab, changePage, changeActiveTab } =
    useMetafieldDefinitionFilters();
  const [paginateDefinition, setPaginateDefinition] =
    useState<PaginationFilter>({
      limit: 50,
      page: activeTab === TabType.DEFINITION ? page : 1,
    });

  const handlePinDefinition = async ({
    definitionId,
  }: {
    definitionId: number;
  }) => {
    const definition = definitions?.find((item) => item.id === definitionId);
    if (!definition) return;
    try {
      await updateDefinition({
        key: definition.key,
        namespace: definition.namespace,
        ownerResource: definition.ownerResource,
        pin: !definition.pin,
      }).unwrap();
      showToast({
        type: "success",
        message: `${definition.pin ? "Bỏ ghim" : "Ghim"} định nghĩa ${
          definition?.name
        } thành công`,
      });
    } catch (error) {
      if (isClientError(error)) {
        showToast({
          type: "error",
          message: `${definition.pin ? "Bỏ ghim" : "Ghim"} định nghĩa ${
            definition?.name
          } không thành công`,
          description: error.data.errors
            .map((error) => error.message)
            .join(", "),
        });
      }
    }
  };

  const definitionColumns: ColumnsType<MetafieldDefinitionResponse> = [
    {
      title: "Tên định nghĩa",
      key: "name",
      width: "35%",
      render: (_, record) => (
        <Space direction="vertical">
          <Text>{record.name}</Text>
          <Text type="secondary">{`${record.namespace}.${record.key}`}</Text>
        </Space>
      ),
    },
    {
      title: "Loại nội dung",
      dataIndex: "type",
      key: "type",
      width: "30%",
      render: (_, record) => {
        const InfoType = getInfoType(record.type).icon;
        return (
          <Text>
            {InfoType && <InfoType style={{ marginRight: 4 }} />}
            {getInfoType(record.type).label}
          </Text>
        );
      },
    },
    {
      title: "Số lượng áp dụng",
      dataIndex: "key",
      key: "key",
      width: "30%",
      render: (_, record) => (
        <Text>{`${record.metafieldsCount} ${getOwnerResourceName(
          record.ownerResource
        ).toLowerCase()}`}</Text>
      ),
    },
    {
      key: "action",
      width: "5%",
      render: (_, record) => (
        <Tooltip
          title={`${
            record.pin ? "Bỏ ghim khỏi" : "Ghim vào"
          } ${getOwnerResourceName(record.ownerResource).toLowerCase()}`}
        >
          <Button
            type="default"
            shape="circle"
            size="small"
            icon={record.pin ? <PushpinFilled /> : <PushpinOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handlePinDefinition({ definitionId: record.id });
            }}
          ></Button>
        </Tooltip>
      ),
    },
  ];

  const columns: ColumnsType<TableItem> = [
    {
      title: "Thông tin",
      dataIndex: "info",
      key: "info",
      render: (text: string, record: TableItem) => (
        <Space>
          {record.icon}
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Định nghĩa",
      dataIndex: "value",
      key: "value",
      align: "right" as const,
    },
  ];

  const {
    data: metafieldDefinitionCount,
    isLoading: isLoadingCountByResource,
    isFetching: isFetchingCountByResource,
  } = useDefinitionCountByResourceQuery();

  const {
    data: count,
    isLoading: isLoadingCount,
    isFetching: isFetchingCount,
  } = useCountMetafieldDefinitionQuery(
    {
      owner_resource: ownerResource,
    },
    {
      skip: !ownerResource,
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: definitions,
    isLoading: isLoadingDefinitions,
    isFetching: isFetchingDefinitions,
  } = useGetMetafieldDefinitionsQuery(
    {
      owner_resource: ownerResource,
      page,
      limit: LIMIT,
      sort_key: "pinned_position",
    },
    {
      refetchOnMountOrArgChange: true,
      skip: activeTab !== TabType.DEFINITION || !ownerResource,
    }
  );

  const [definitionsPinned, setDefinitionsPinned] = useState<
    MetafieldDefinitionResponse[]
  >((definitions ?? []).filter((definition) => definition.pin));

  useEffect(() => {
    if (!isFetchingDefinitions) {
      setDefinitionsPinned(
        (definitions ?? []).filter((definition) => definition.pin)
      );
    }
  }, [definitions, isFetchingDefinitions]);

  const definitionsNotPinned = useMemo(
    () => (definitions ?? []).filter((definition) => !definition.pin),
    [definitions]
  );

  if (isLoadingCountByResource) {
    return <Loading />;
  }

  const tableData = MetafieldDefinitionSources.map((source) => {
    const count =
      metafieldDefinitionCount?.find(
        (item) => item.ownerResource === source.owner_resource
      )?.count ?? 0;

    const IconComponent = source.icon as unknown as React.ComponentType;
    return {
      key: source.owner_resource,
      icon: <IconComponent />,
      info: source.title,
      value: count,
    };
  });

  const metafieldsDefinitionMarkup =
    isLoadingDefinitions && isLoadingCount ? (
      <Loading />
    ) : (
      <Card>
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Title level={5}>{`Định nghĩa Metafield ${getOwnerResourceName(
            ownerResource ?? MetafieldDefinitionOwnerResource.PRODUCT
          ).toLowerCase()}`}</Title>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() =>
              navigate(`/admin/metafields/${ownerResource}/create`)
            }
          >
            Thêm định nghĩa
          </Button>
        </Space>
        <Tabs
          defaultActiveKey="1"
          style={{ marginTop: 16 }}
          items={[
            {
              key: "1",
              label: "Định nghĩa",
              children: (
                <Table
                  columns={definitionColumns}
                  dataSource={definitionsPinned.concat(definitionsNotPinned)}
                  loading={isFetchingCount || isFetchingDefinitions}
                  rowClassName="hoverable-row"
                  scroll={{ x: "max-content" }}
                  pagination={{
                    pageSize: paginateDefinition.limit,
                    current: paginateDefinition.page,
                    total: count,
                    onChange: (page, pageSize) => {},
                  }}
                  rowKey={(record) => record.id.toString()}
                  onRow={(record) => ({
                    onClick: () => {
                      navigate(
                        `/admin/metafields/${ownerResource}/${record.id}`
                      );
                    },
                  })}
                />
              ),
            },
            {
              key: "2",
              label: "Metafield không có định nghĩa",
              children: <div>Nội dung tab 2</div>,
            },
          ]}
        />
      </Card>
    );

  return (
    <StyledContainer>
      <Row gutter={[16, 16]}>
        <Col xl={10} md={10} xs={24}>
          <Card>
            <Title level={5}>Danh sách định nghĩa</Title>
            <Text type="secondary">
              Thêm các dữ liệu giúp bạn tùy chỉnh chức năng và giao diện của cửa
              hàng
            </Text>
            <Table
              columns={columns}
              dataSource={tableData}
              loading={isFetchingCountByResource}
              pagination={false}
              onRow={(record) => ({
                onClick: () => {
                  setOwnerResource(record.key);
                },
              })}
              rowClassName={(record) =>
                record.key === ownerResource ? "selected-row" : ""
              }
              style={{ marginTop: 16 }}
            />
          </Card>
        </Col>
        <Col xl={14} md={14} xs={24}>
          {ownerResource && metafieldsDefinitionMarkup}
        </Col>
      </Row>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
