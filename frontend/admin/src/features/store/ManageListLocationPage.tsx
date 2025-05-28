import { StoreInfoState } from "@/client";
import { HomeOutlined, PlusCircleOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Button, Card, List, Progress, Tooltip, Typography } from "antd";
import { useSelector } from "react-redux";
import { useGetLocationsQuery } from "./api";
import { Loading } from "../admin/Loading";
import CustomTag from "@/components/tag/CustomTag";
import { useToggle } from "@/utils/useToggle";
import LocationModal from "./components/LocationModal";
import { useState } from "react";

export default function ManageListLocationPage() {
  const {
    value: isOpenModal,
    setFalse: closeModal,
    setTrue: openModal,
  } = useToggle(false);
  const [selectedLocationId, setSelectedLocationId] = useState<
    number | undefined
  >(undefined);

  const handleOpenModal = (locationId?: number) => {
    setSelectedLocationId(locationId);
    openModal();
  };

  const { maxLocation } = useSelector(
    (state: StoreInfoState) => state.storeInfo
  );

  const {
    data: locationsWithCount,
    isLoading: isLoadingLocations,
    isFetching: isFetchingLocations,
  } = useGetLocationsQuery({});

  const { locations = [], count = 0 } = locationsWithCount || {};

  if (isLoadingLocations) {
    return <Loading />;
  }

  return (
    <StyledContainer>
      <Card title="Tổng quan chi nhánh">
        <Tooltip title="Số chi nhánh của cửa hàng">
          <Progress
            percent={Number(((count * 100) / maxLocation).toFixed(0))}
          />
        </Tooltip>
        <StyledCountLocation>
          <Typography.Text>
            Chi nhánh quản lý kho đang hoạt động
          </Typography.Text>
          <Typography.Text>{count}</Typography.Text>
        </StyledCountLocation>
        <StyledCountLocation>
          <Typography.Text>
            Chi nhánh quản lý kho được hoạt động tối đa
          </Typography.Text>
          <Typography.Text>{maxLocation}</Typography.Text>
        </StyledCountLocation>
      </Card>
      <Card
        title="Danh sách chi nhánh"
        extra={
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => handleOpenModal()}
          >
            Thêm mới chi nhánh
          </Button>
        }
      >
        <List
          itemLayout="horizontal"
          dataSource={locations}
          loading={isFetchingLocations}
          renderItem={(location) => (
            <StyledInfoLocation onClick={() => handleOpenModal(location.id)}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Button disabled icon={<HomeOutlined />} />
                <StyledInfo>
                  <Typography.Title level={5}>{location.name}</Typography.Title>
                  <Typography.Text type="secondary">
                    {`ID chi nhánh: ${location.id} - Địa chỉ: ${location.address1}`}
                  </Typography.Text>
                </StyledInfo>
              </div>

              <div>
                {location.defaultLocation && (
                  <CustomTag color="blue">Mặc định</CustomTag>
                )}
                <CustomTag color="green">Đang hoạt động</CustomTag>
              </div>
            </StyledInfoLocation>
          )}
          pagination={
            count > 0
              ? {
                  current: 1,
                  pageSize: 20,
                  total: count,
                  showSizeChanger: false,
                  onChange: (page, pageSize) => {},
                }
              : false
          }
        />
      </Card>
      {isOpenModal && (
        <LocationModal
          isOpen={isOpenModal}
          onClose={() => {
            setSelectedLocationId(undefined);
            closeModal();
          }}
          locationId={selectedLocationId}
        />
      )}
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledCountLocation = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledInfoLocation = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 0;
  cursor: pointer;
  border-bottom: 1px solid rgb(232, 234, 235);
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: #eeefef;
  }
`;

const StyledInfo = styled.div`
  display: flex;
  flex-direction: column;
`;
