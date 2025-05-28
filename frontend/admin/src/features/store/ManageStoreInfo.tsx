import styled from "@emotion/styled";
import {
  useGetCurrentUserQuery,
  useGetStoreByIdQuery,
  useUpdateStoreMutation,
  useUpdateUserMutation,
} from "./api";
import { Loading } from "../admin/Loading";
import { Button, Card, Col, Form, Input, Row, Select, Typography } from "antd";
import { UpdateStoreRequest } from "@/types/store";
import { useGetCountriesQuery, useGetProvincesQuery } from "@/api";
import { CustomForm } from "@/components/form/CustomForm";
import { useCustomForm } from "@/components/form/useCustomForm";
import { useMemo } from "react";
import { useToast } from "@/components/Toast";

export default function ManageStoreInfo() {
  const { showToast } = useToast();
  const { data: store, isLoading: isLoadingStore } = useGetStoreByIdQuery();
  const { data: user, isLoading: isLoadingUser } = useGetCurrentUserQuery();

  const initialValues = useMemo(() => {
    if (!store) return undefined;
    return {
      name: store.name ?? "",
      phoneNumber: store.phoneNumber ?? "",
      email: store.email ?? "",
      address: store.address ?? "",
      countryCode: store.countryCode ?? "",
      provinceCode: store.provinceCode ?? "",
    };
  }, [store]);
  const formStore = useCustomForm<UpdateStoreRequest>(initialValues);

  const [updateStore, { isLoading: isUpdating }] = useUpdateStoreMutation();
  const handleUpdateStore = async () => {
    try {
      await updateStore(formStore.getFieldsValue()).unwrap();
      showToast({
        type: "success",
        message: "Cập nhật thông tin cửa hàng thành công",
        duration: 3,
      });
    } catch (error) {
      showToast({
        type: "error",
        message: "Cập nhật thông tin cửa hàng thất bại",
        duration: 3,
      });
    }
  };

  const initialValuesUser = useMemo(() => {
    if (!user) return undefined;
    return {
      email: user.email ?? "",
      phoneNumber: user.phoneNumber ?? "",
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
    };
  }, [user]);
  const formUser = useCustomForm(initialValuesUser);

  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const handleUpdateUser = async () => {
    try {
      await updateUser(formUser.getFieldsValue()).unwrap();
      showToast({
        type: "success",
        message: "Cập nhật thông tin tài khoản thành công",
        duration: 3,
      });
    } catch (error) {
      showToast({
        type: "error",
        message: "Cập nhật thông tin tài khoản thất bại",
        duration: 3,
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

  if (
    isLoadingStore ||
    isLoadingCountries ||
    isLoadingProvinces ||
    isLoadingUser
  ) {
    return <Loading />;
  }

  return (
    <StyledContainer>
      <Card title="Thông tin cửa hàng">
        <CustomForm
          initialValues={initialValues}
          form={formStore}
          layout="vertical"
          onFinish={handleUpdateStore}
        >
          <Row gutter={[16, 16]}>
            <Col xl={12} md={12} xs={24}>
              <Typography.Title level={5}>Tên cửa hàng</Typography.Title>
              <Form.Item
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên cửa hàng" },
                ]}
              >
                <Input placeholder="Nhập tên cửa hàng" />
              </Form.Item>
            </Col>
            <Col xl={12} md={12} xs={24}>
              <Typography.Title level={5}>Số điện thoại</Typography.Title>
              <Form.Item
                name="phoneNumber"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xl={12} md={12} xs={24}>
              <Typography.Title level={5}>Email</Typography.Title>
              <Form.Item
                name="email"
                rules={[{ required: true, message: "Vui lòng nhập email" }]}
              >
                <Input placeholder="Nhập địa chỉ email" />
              </Form.Item>
            </Col>
            <Col xl={12} md={12} xs={24}>
              <Typography.Title level={5}>Địa chỉ</Typography.Title>
              <Form.Item
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
              >
                <Input placeholder="Nhập địa chỉ cửa hàng" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
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
            <Col xl={12} md={12} xs={24}>
              <Typography.Title level={5}>Tỉnh/Thành phố</Typography.Title>
              <Form.Item
                name="provinceCode"
                rules={[
                  { required: true, message: "Vui lòng chọn tỉnh/thành phố" },
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
          </Row>
          <StyledBottomCard>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => formStore.resetFields()}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isUpdating}
              disabled={!formStore.isDirty}
            >
              Lưu
            </Button>
          </StyledBottomCard>
        </CustomForm>
      </Card>
      <Card title="Thông tin tài khoản">
        <CustomForm
          initialValues={initialValuesUser}
          form={formUser}
          onFinish={handleUpdateUser}
          layout="vertical"
        >
          <Row gutter={[16, 16]}>
            <Col xl={12} md={12} xs={24}>
              <Typography.Title level={5}>Họ và tên đệm</Typography.Title>
              <Form.Item name="firstName">
                <Input placeholder="Nhập họ và tên đệm" />
              </Form.Item>
            </Col>
            <Col xl={12} md={12} xs={24}>
              <Typography.Title level={5}>Tên</Typography.Title>
              <Form.Item name="lastName">
                <Input placeholder="Nhập tên" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xl={12} md={12} xs={24}>
              <Typography.Title level={5}>Email</Typography.Title>
              <Form.Item name="email">
                <Input placeholder="Nhập email tài khoản" />
              </Form.Item>
            </Col>
            <Col xl={12} md={12} xs={24}>
              <Typography.Title level={5}>Số điện thoại</Typography.Title>
              <Form.Item name="phoneNumber">
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
          </Row>
          <StyledBottomCard>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => formUser.resetFields()}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isUpdatingUser}
              disabled={!formUser.isDirty}
            >
              Lưu
            </Button>
          </StyledBottomCard>
        </CustomForm>
      </Card>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledBottomCard = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
  gap: 8px;
`;
