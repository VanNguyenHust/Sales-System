import React from "react";
import { Form, Input, Button, Typography, Row, Col, notification } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  FacebookOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import { LoginRequest } from "../types/user";
import { useLoginStoreMutation } from "../api";

const { Title, Text } = Typography;

const LoginStorePage: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();
  const [formLogin] = Form.useForm<LoginRequest>();

  const [login, { isLoading: isLogin }] = useLoginStoreMutation();

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

  const handleLogin = async (values: LoginRequest) => {
    try {
      const response = await login(values).unwrap();
      window.location.href =
        "http://localhost:5173/admin/authorize?token=" + response.token;
    } catch (error) {
      openNotification({
        type: "error",
        title: "Đăng nhập cửa hàng thất bại",
        description:
          (error as any)?.data?.errors?.[0]?.message ||
          "Đã xảy ra lỗi không xác định",
      });
    }
  };

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
            Đăng nhập vào cửa hàng của bạn
          </Title>
        </Row>
        <Form layout="vertical" onFinish={handleLogin} form={formLogin}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email" }]}
          >
            <Input placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password
              placeholder="Mật khẩu"
              size="large"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Row justify="space-between" style={{ marginBottom: "1rem" }}>
            <Col>
              <div style={{ textAlign: "right" }}>
                <a href="forgot_password" style={{ color: "#1890ff" }}>
                  Quên mật khẩu
                </a>
              </div>
            </Col>
            <Col>
              <Text type="secondary" style={{ fontSize: 14 }}>
                Chưa có tài khoản?{" "}
                <a href="/register" style={{ color: "#1890ff" }}>
                  Đăng ký
                </a>
              </Text>
            </Col>
          </Row>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={isLogin}
              style={{
                borderRadius: 24,
                background: "linear-gradient(90deg, #00c270, #00a164)",
                border: "none",
              }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
        <Text
          type="secondary"
          style={{ display: "block", textAlign: "center", margin: "1rem 0" }}
        >
          Hoặc đăng nhập với
        </Text>
        <Row gutter={16} justify="center">
          <Col span={10}>
            <Button
              icon={<FacebookOutlined />}
              block
              style={{ background: "#3b5998", color: "#fff", borderRadius: 24 }}
            >
              Facebook
            </Button>
          </Col>
          <Col span={10}>
            <Button
              icon={<GoogleOutlined />}
              block
              style={{ background: "#4285f4", color: "#fff", borderRadius: 24 }}
            >
              Google
            </Button>
          </Col>
        </Row>
      </Col>
    </div>
  );
};

export default LoginStorePage;
