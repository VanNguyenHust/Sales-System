import {
  Button,
  Card,
  Col,
  Descriptions,
  notification,
  Row,
  Table,
  Tag,
} from "antd";
import {
  useDisableStoreFeatureMutation,
  useEnableStoreFeatureMutation,
  useGetStoreByIdQuery,
  useGetStoreFeaturesQuery,
} from "../../api";
import { useParams } from "react-router-dom";
import { Loading } from "../../components/Loading";
import { StoreStatusKey } from "../../types/stores";
import { snakeCase } from "lodash";
import { StoreFeatureLabel } from "../../types/store_features";
import { useState } from "react";

export default function ManageStoreDetailPage() {
  const storeId = Number(useParams<{ storeId: string }>().storeId);
  const [loadingFeatureKey, setLoadingFeatureKey] = useState<string | null>(
    null
  );

  const [api, contextHolder] = notification.useNotification();
  const openNotification = ({
    title,
    description,
    type = "info",
  }: {
    title: string;
    description: string;
    type?: "success" | "error" | "info" | "warning";
  }) => {
    api.open({
      type,
      message: title,
      description: description,
      showProgress: true,
      duration: 3,
    });
  };

  const {
    data: store,
    isLoading,
    isFetching: isFetchingStore,
  } = useGetStoreByIdQuery(
    { storeId },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: storeFeature,
    isLoading: isLoadingStoreFeature,
    isFetching: isFetchingStoreFeature,
  } = useGetStoreFeaturesQuery(
    { storeId },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [enableStoreFeature] = useEnableStoreFeatureMutation();
  const [disableStoreFeature] = useDisableStoreFeatureMutation();

  const handleActivateFeature = async (
    featureKey: string,
    enabled: boolean
  ) => {
    setLoadingFeatureKey(featureKey);
    console.log(enabled);
    try {
      if (enabled) {
        await disableStoreFeature({ storeId, featureKey }).unwrap();
      } else {
        await enableStoreFeature({ storeId, featureKey }).unwrap();
      }
      openNotification({
        title: "Kích hoạt cửa hàng thành công",
        description: `Đã ${enabled ? "tắt" : "kích hoạt"} tính năng ${
          StoreFeatureLabel[
            snakeCase(featureKey) as keyof typeof StoreFeatureLabel
          ]
        }`,
        type: "success",
      });
    } catch (error) {
      openNotification({
        type: "error",
        title: "Kích hoạt cửa hàng thất bại",
        description:
          (error as any)?.data?.errors?.[0]?.message ||
          "Đã xảy ra lỗi không xác định",
      });
    } finally {
      setLoadingFeatureKey(null);
    }
  };

  if (isLoading || isLoadingStoreFeature) {
    return <Loading />;
  }

  return (
    <Col>
      {contextHolder}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Card
          title="Thông tin cửa hàng"
          style={{ width: "100%" }}
          loading={isFetchingStore}
        >
          <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }} size="middle">
            <Descriptions.Item label="Mã cửa hàng">
              {store?.id}
            </Descriptions.Item>
            <Descriptions.Item label="Tên cửa hàng">
              {store?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Tỉnh thành">
              {store?.province}
            </Descriptions.Item>
            <Descriptions.Item label="Email">{store?.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {store?.phoneNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Chủ cửa hàng">
              {store?.storeOwner}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {StoreStatusKey[store?.status ?? 0]}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {store?.createdOn}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày hết hạn">
              {store?.endDate}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Row>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Card
          title="Thông tin gói dịch vụ"
          style={{ width: "100%" }}
          loading={isFetchingStoreFeature}
        >
          <Table
            dataSource={Object.entries(storeFeature?.features || []).map(
              ([key, value]) => ({
                key,
                feature: key,
                enabled: value,
              })
            )}
            pagination={false}
            columns={[
              {
                title: "STT",
                key: "index",
                render: (_: any, __: any, index: number) => index + 1,
                width: 60,
              },
              {
                title: "Tính năng",
                dataIndex: "feature",
                key: "feature",
                render: (feature: string) => {
                  return StoreFeatureLabel[
                    snakeCase(feature) as keyof typeof StoreFeatureLabel
                  ];
                },
              },
              {
                title: "Trạng thái",
                dataIndex: "enabled",
                key: "enabled",
                render: (enabled: boolean) =>
                  enabled ? (
                    <Tag color="green">Đang kích hoạt</Tag>
                  ) : (
                    <Tag color="red">Đã tắt</Tag>
                  ),
              },
              {
                key: "action",
                render: (_, record) => {
                  const featureKey = snakeCase(record.feature);
                  return (
                    <Button
                      type={record.enabled ? "default" : "primary"}
                      danger={record.enabled}
                      loading={loadingFeatureKey === featureKey}
                      onClick={() =>
                        handleActivateFeature(featureKey, record.enabled)
                      }
                    >
                      {record.enabled ? "Ngừng kích hoạt" : "Kích hoạt"}
                    </Button>
                  );
                },
              },
            ]}
          />
        </Card>
      </Row>
    </Col>
  );
}
