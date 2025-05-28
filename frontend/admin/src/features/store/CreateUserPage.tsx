import { CustomForm } from "@/components/form/CustomForm";
import { useCustomForm } from "@/components/form/useCustomForm";
import { CreateUserRequest } from "@/types/store";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Row, Select, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAdminUpdateUserMutation,
  useCreateUserAccountMutation,
  useGetUserByIdQuery,
} from "./api";
import { useToast } from "@/components/Toast";
import styled from "@emotion/styled";
import { useMemo } from "react";
import { defaultColumnsPermission } from "./constants";
import { PermissionColumnGroup } from "./type";
import { isClientError } from "@/client";
import { Loading } from "../admin/Loading";

export default function CreateUserPage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const backLink = "/admin/users";
  const { showToast } = useToast();

  const [updateUser, { isLoading: isUpdating }] = useAdminUpdateUserMutation();
  const { data: userData, isLoading: isLoadingUser } = useGetUserByIdQuery(
    { userId: Number(userId) },
    { skip: !userId }
  );

  const initialValuesForm = useMemo(() => {
    if (!userData) {
      return {
        email: "",
        phoneNumber: "",
        firstName: "",
        lastName: "",
        permissions: "",
      };
    } else {
      return {
        email: userData?.email ?? "",
        phoneNumber: userData?.phoneNumber ?? "",
        firstName: userData?.firstName ?? "",
        lastName: userData?.lastName ?? "",
        permissions: userData?.permissions.join(",") ?? "",
      };
    }
  }, [userData]);
  const formCreate = useCustomForm<CreateUserRequest>(initialValuesForm);

  const handleChange = (groupValue: string, values: string[]) => {
    const currentPermissions =
      formCreate.getFieldValue("permissions")?.split(",") || [];
    const otherGroupPermissions = currentPermissions.filter(
      (permission: string) => {
        const group = defaultColumnsPermission.find(
          (g) => g.value === groupValue
        );
        return !group?.columns.some((col) => col.key === permission);
      }
    );
    const newPermissions = [...otherGroupPermissions, ...values];
    formCreate.setFieldValue("permissions", newPermissions.join(","));
  };

  const handleResetFields = () => {
    formCreate.resetFields();
  };

  const [createUser, { isLoading: isCreating }] =
    useCreateUserAccountMutation();

  const handleCreateOrUpdateUser = async () => {
    try {
      if (userId) {
        await updateUser({
          userId: Number(userId),
          body: formCreate.getFieldsValue(),
        }).unwrap();
        showToast({
          type: "success",
          message: "Cập nhật tài khoản nhân viên thành công",
          duration: 3,
        });
      } else {
        await createUser(formCreate.getFieldsValue()).unwrap();
        showToast({
          type: "success",
          message: "Tạo tài khoản nhân viên thành công",
          description: "Đã gửi lời mời đến email của nhân viên",
          duration: 3,
        });
      }
    } catch (error) {
      if (isClientError(error)) {
        showToast({
          type: "error",
          message: "Tạo tài khoản nhân viên thất bại",
          description: error.data.errors[0].message,
          duration: 3,
        });
      }
    }
  };

  const renderSelect = (group: PermissionColumnGroup) => {
    const formPermissions =
      formCreate.getFieldValue("permissions")?.split(",") || [];
    const groupPermissions = formPermissions.filter((permission: string) =>
      group.columns.some((col) => col.key === permission)
    );

    return (
      <Select
        mode="multiple"
        allowClear
        style={{ width: "100%" }}
        placeholder={`Chọn quyền cho chức năng ${group.groupName.toLowerCase()}`}
        value={groupPermissions}
        onChange={(values) => handleChange(group.value, values)}
      >
        {group.columns.map((col) => (
          <Select.Option key={col.key} value={col.key}>
            {col.label}
          </Select.Option>
        ))}
      </Select>
    );
  };

  const groupedPermissions = useMemo(() => {
    const result: Record<number, PermissionColumnGroup[]> = {};
    defaultColumnsPermission.forEach((permission) => {
      if (!result[permission.index]) {
        result[permission.index] = [];
      }
      result[permission.index].push(permission);
    });
    return result;
  }, []);

  if (isLoadingUser) {
    return <Loading />;
  }

  return (
    <CustomForm
      initialValues={initialValuesForm}
      form={formCreate}
      onFinish={handleCreateOrUpdateUser}
      layout="vertical"
    >
      <Card
        title={
          <div>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(backLink)}
              style={{ marginRight: 8 }}
            />
            {userId
              ? "Chỉnh sửa tài khoản nhân viên"
              : "Thêm mới tài khoản nhân viên"}
          </div>
        }
        extra={
          <StyledExtraCard>
            <Button
              color="primary"
              variant="outlined"
              onClick={handleResetFields}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreating || isUpdating}
              disabled={!formCreate.isDirty}
            >
              {userId ? "Lưu" : "Gửi lời mời"}
            </Button>
          </StyledExtraCard>
        }
      >
        <Row gutter={[16, 16]}>
          <Col xl={12} md={12} xs={24}>
            <Typography.Title level={5}>Họ và tên đệm</Typography.Title>
            <Form.Item
              name="firstName"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập họ và tên đệm",
                },
              ]}
            >
              <Input placeholder="Nhập họ và tên đệm" />
            </Form.Item>
            <Typography.Title level={5}>Tên</Typography.Title>
            <Form.Item
              name="lastName"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên",
                },
              ]}
            >
              <Input placeholder="Nhập tên" />
            </Form.Item>
          </Col>
          <Col xl={12} md={12} xs={24}>
            <Typography.Title level={5}>Email</Typography.Title>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Vui lòng nhập email" }]}
            >
              <Input placeholder="Nhập email tài khoản" />
            </Form.Item>
            <Typography.Title level={5}>Số điện thoại</Typography.Title>
            <Form.Item
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số điện thoại",
                },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      <Card title="Phân quyền tài khoản">
        <Form.Item name="permissions" hidden>
          <Input />
        </Form.Item>
        <Row gutter={[16, 16]}>
          {Object.entries(groupedPermissions).map(([index, groups]) => (
            <Col key={index} xl={12} md={12} xs={24}>
              {groups.map((group) => (
                <div key={group.value} style={{ marginBottom: 24 }}>
                  <Typography.Title level={5}>
                    Chức năng {group.groupName.toLowerCase()}
                  </Typography.Title>
                  {renderSelect(group)}
                </div>
              ))}
            </Col>
          ))}
        </Row>
      </Card>
    </CustomForm>
  );
}

const StyledExtraCard = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
  gap: 8px;
`;
