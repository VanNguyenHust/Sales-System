import { useSearchParams } from "react-router-dom";
import { useConfirmInvitedMutation, useResetPasswordMutation } from "../api";
import { useEffect, useState, useRef } from "react";
import { Form, Input, Button, Typography, Row, Col, notification } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const { Title } = Typography;

export default function ConfirmInvited() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const storeId = searchParams.get("storeId");
  const confirmCode = searchParams.get("confirmCode");

  const [newToken, setNewToken] = useState("");
  const [confirmSuccess, setConfirmSuccess] = useState(false);
  const hasConfirmed = useRef(false);
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();

  const [confirmInvited] = useConfirmInvitedMutation();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

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

  useEffect(() => {
    const confirm = async () => {
      if (email && storeId && confirmCode && !hasConfirmed.current) {
        hasConfirmed.current = true;
        try {
          const response = await confirmInvited({
            email: email,
            storeId: Number(storeId),
            confirmCode: confirmCode,
          }).unwrap();

          setNewToken(response);
          setConfirmSuccess(true);

          openNotification({
            type: "success",
            title: "Xác nhận thành công",
            description: "Vui lòng tạo mật khẩu mới cho tài khoản của bạn",
          });
        } catch (error) {
          console.log(error);
          hasConfirmed.current = false;
          openNotification({
            type: "error",
            title: "Xác nhận thất bại",
            description:
              (error as any)?.data?.errors?.[0]?.message ||
              "Đã xảy ra lỗi không xác định",
          });
        }
      }
    };
    confirm();
  }, [email, storeId, confirmCode, confirmInvited]);

  const handleSetPassword = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      openNotification({
        type: "error",
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp",
      });
      return;
    }

    try {
      await resetPassword({
        storeId: Number(storeId),
        email: email || "",
        tokenCode: newToken,
        newPassword: values.password,
        confirmPassword: values.confirmPassword,
      }).unwrap();

      openNotification({
        type: "success",
        title: "Thành công",
        description: "Đã đặt mật khẩu thành công",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      openNotification({
        type: "error",
        title: "Lỗi",
        description:
          (error as any)?.data?.errors?.[0]?.message ||
          "Đã xảy ra lỗi không xác định",
      });
    }
  };

  if (!confirmSuccess) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f5faff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {contextHolder}
        <div>Đang xác thực...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5faff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {contextHolder}
      <Col
        xs={22}
        sm={20}
        md={16}
        lg={12}
        xl={8}
        style={{
          minWidth: 600,
          background: "#fff",
          padding: "2rem",
          borderRadius: 16,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Row justify="center" style={{ marginBottom: "1.5rem" }}>
          <Title level={4} style={{ marginTop: 16 }}>
            Tạo mật khẩu mới
          </Title>
        </Row>

        <Form layout="vertical" onFinish={handleSetPassword} form={form}>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password
              placeholder="Mật khẩu mới"
              size="large"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password
              placeholder="Xác nhận mật khẩu"
              size="large"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={isLoading}
              style={{
                borderRadius: 24,
                background: "linear-gradient(90deg, #00c270, #00a164)",
                border: "none",
              }}
            >
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </div>
  );
}
