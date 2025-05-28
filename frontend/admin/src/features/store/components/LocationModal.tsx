import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Typography,
} from "antd";
import styled from "@emotion/styled";
import { useCreateLocationMutation, useGetLocationByIdQuery } from "../api";
import { CustomForm } from "@/components/form/CustomForm";
import {
  useGetCountriesQuery,
  useGetDistrictsQuery,
  useGetProvincesQuery,
  useGetWardsQuery,
} from "@/api";
import { Loading } from "@/features/admin/Loading";
import { CreateLocationRequest, LocationResponse } from "@/types/store";
import { useMemo } from "react";
import { useCustomForm } from "@/components/form/useCustomForm";
import { useToast } from "@/components/Toast";
import { isClientError } from "@/client";

interface LocationModalProps {
  locationId?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function LocationModal({
  locationId,
  isOpen,
  onClose,
}: LocationModalProps) {
  const { showToast } = useToast();
  const {
    data: location,
    isLoading: isLoadingUser,
    isFetching: isFetchingUser,
  } = useGetLocationByIdQuery(
    { locationId: locationId ?? 0 },
    {
      skip: !locationId,
    }
  );

  const initialValuesForm: CreateLocationRequest = useMemo(() => {
    if (!location || !locationId) return {} as CreateLocationRequest;
    return {
      name: location.name,
      code: location.code,
      phone: location.phone,
      email: location.email,
      countryCode: location.countryCode,
      provinceCode: location.provinceCode,
      districtCode: location.districtCode,
      wardCode: location.wardCode,
      address1: location.address1,
      // defaultLocation: location.defaultLocation,
    } as CreateLocationRequest;
  }, [location, locationId]);
  const formLocation = useCustomForm<CreateLocationRequest>(initialValuesForm);

  const [createLocation, { isLoading: isCreating }] =
    useCreateLocationMutation();
  const handleAction = async () => {
    try {
      await createLocation(formLocation.getFieldsValue()).unwrap();
      showToast({
        type: "success",
        message: locationId
          ? "Cập nhật chi nhánh thành công"
          : "Thêm mới chi nhánh thành công",
      });
      onClose();
    } catch (error) {
      isClientError(error) &&
        showToast({
          type: "error",
          message: locationId
            ? "Cập nhật chi nhánh thất bại"
            : "Thêm mới chi nhánh thất bại",
          description: error.data.errors.map((err) => err.message).join(", "),
        });
    }
  };

  const {
    data: countries,
    isLoading: isLoadingCountries,
    isFetching: isFetchingCountries,
  } = useGetCountriesQuery({});

  const {
    data: provinces,
    isLoading: isLoadingProvinces,
    isFetching: isFetchingProvinces,
  } = useGetProvincesQuery({});

  const {
    data: districts,
    isLoading: isLoadingDistricts,
    isFetching: isFetchingDistricts,
  } = useGetDistrictsQuery(
    {
      provinceCode: formLocation.getFieldValue("provinceCode"),
    },
    {
      skip: !formLocation.getFieldValue("provinceCode"),
    }
  );

  const {
    data: wards,
    isLoading: isLoadingWards,
    isFetching: isFetchingWards,
  } = useGetWardsQuery(
    {
      provinceCode: formLocation.getFieldValue("provinceCode"),
      districtCode: formLocation.getFieldValue("districtCode"),
    },
    {
      skip: !formLocation.getFieldValue("districtCode"),
    }
  );

  return (
    <StyledModal
      title={locationId ? "Chi tiết chi nhánh" : "Thêm mới chi nhánh"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Divider size="small" />
      {isLoadingCountries || isLoadingProvinces || isLoadingUser ? (
        <Loading />
      ) : (
        <CustomForm
          initialValues={initialValuesForm}
          form={formLocation}
          onFinish={handleAction}
        >
          <Row gutter={[16, 16]} style={{ rowGap: 0 }}>
            <Col xl={12} md={12} xs={24}>
              <Typography.Title level={5}>Tên chi nhánh</Typography.Title>
              <Form.Item
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên chi nhánh" },
                ]}
              >
                <Input placeholder="Nhập chi nhánh" />
              </Form.Item>
            </Col>
            <Col xl={12} md={12} xs={24}>
              <Typography.Title level={5}>Mã chi nhánh</Typography.Title>
              <Form.Item
                name="code"
                rules={[
                  { required: true, message: "Vui lòng nhập mã chi nhánh" },
                ]}
              >
                <Input placeholder="Nhập tên chi nhánh" />
              </Form.Item>
            </Col>
            <Col xl={12} md={12} xs={24}>
              <Typography.Title level={5}>Số điện thoại</Typography.Title>
              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col xl={12} md={12} xs={24}>
              <Typography.Title level={5}>Email</Typography.Title>
              <Form.Item
                name="email"
                rules={[{ required: true, message: "Vui lòng nhập email" }]}
              >
                <Input placeholder="Nhập email chi nhánh" />
              </Form.Item>
            </Col>
            <Col xl={12} md={12} xs={24}>
              <Typography.Title level={5}>Quốc gia</Typography.Title>
              <Form.Item
                name="countryCode"
                rules={[{ required: true, message: "Vui lòng chọn quốc gia" }]}
              >
                <Select
                  placeholder="Chọn quốc gia"
                  options={countries?.map((country) => ({
                    label: country.name,
                    value: country.code,
                  }))}
                  loading={isFetchingCountries}
                  showSearch
                  allowClear
                />
              </Form.Item>
            </Col>
            {formLocation.getFieldValue("countryCode") === "VN" && (
              <>
                <Col xl={12} md={12} xs={24}>
                  <Typography.Title level={5}>Tỉnh/Thành phố</Typography.Title>
                  <Form.Item
                    name="provinceCode"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn tỉnh/thành phố",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Chọn tỉnh/thành phố"
                      options={provinces?.map((province) => ({
                        label: province.name,
                        value: province.code,
                      }))}
                      loading={isFetchingProvinces}
                      showSearch
                      allowClear
                    />
                  </Form.Item>
                </Col>
                <Col xl={12} md={12} xs={24}>
                  <Typography.Title level={5}>Quận huyện</Typography.Title>
                  <Form.Item
                    name="districtCode"
                    rules={[
                      { required: true, message: "Vui lòng chọn quận huyện" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn quận huyện"
                      options={districts?.map((district) => ({
                        label: district.name,
                        value: district.code,
                      }))}
                      loading={isFetchingDistricts}
                      disabled={!formLocation.getFieldValue("provinceCode")}
                      showSearch
                      allowClear
                    />
                  </Form.Item>
                </Col>
                <Col xl={12} md={12} xs={24}>
                  <Typography.Title level={5}>Phường xã</Typography.Title>
                  <Form.Item
                    name="wardCode"
                    rules={[
                      { required: true, message: "Vui lòng chọn phường xã" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn phường xã"
                      options={wards?.map((ward) => ({
                        label: ward.name,
                        value: ward.code,
                      }))}
                      loading={isFetchingWards}
                      disabled={!formLocation.getFieldValue("districtCode")}
                      showSearch
                      allowClear
                    />
                  </Form.Item>
                </Col>
              </>
            )}
            <Col xl={24} md={24} xs={24}>
              <Typography.Title level={5}>Địa chỉ</Typography.Title>
              <Form.Item
                name="address1"
                rules={[{ required: true, message: "Vui lòng nhập email" }]}
              >
                <Input placeholder="Nhập địa chỉ chi tiết" />
              </Form.Item>
            </Col>
          </Row>
          <StyledBottomCard>
            {!locationId && (
              <Button color="primary" variant="outlined" onClick={onClose}>
                Hủy
              </Button>
            )}

            <Button
              type="primary"
              htmlType="submit"
              loading={isCreating}
              disabled={!formLocation.isDirty}
            >
              {locationId ? "Lưu" : "Thêm mới"}
            </Button>
          </StyledBottomCard>
        </CustomForm>
      )}
    </StyledModal>
  );
}

const StyledModal = styled(Modal)``;

const StyledBottomCard = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
  gap: 8px;
`;
