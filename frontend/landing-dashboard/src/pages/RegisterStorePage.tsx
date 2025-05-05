import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Checkbox,
  Button,
  Typography,
  Row,
  Col,
  Divider,
  notification,
} from "antd";
import { FacebookOutlined, GoogleOutlined } from "@ant-design/icons";
import { provinces } from "../constants/province";
import { useEnableStoreMutation, useRegisterStoreMutation } from "../api";
import { useNavigate } from "react-router-dom";
import { EnableStoreRequest, RegisterStoreRequest } from "../types/store";

const { Title, Text } = Typography;
const { Option } = Select;

const RegisterStorePage: React.FC = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [activeTab, setActiveTab] = useState<string>("register");
  const [form] = Form.useForm<RegisterStoreRequest>();
  const [confirmForm] = Form.useForm<EnableStoreRequest>();
  const [agree, setAgree] = useState<boolean>(false);

  const [registerStore, { isLoading }] = useRegisterStoreMutation();
  const [enableStore, { isLoading: isLoadingEnable }] =
    useEnableStoreMutation();

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

  const handleRegisterStore = async () => {
    try {
      await registerStore(form.getFieldsValue()).unwrap();
      setActiveTab("enable");
    } catch (error) {
      openNotification({
        type: "error",
        title: "Đăng ký cửa hàng thất bại",
        description:
          (error as any)?.data?.errors?.[0]?.message ||
          "Đã xảy ra lỗi không xác định",
      });
    }
  };

  const handleEnableStore = async (values: EnableStoreRequest) => {
    try {
      await enableStore({
        ...values,
        name: form.getFieldValue("name"),
      }).unwrap();
      openNotification({
        type: "success",
        title: "Kích hoạt cửa hàng thành công",
        description:
          "Bạn đã kích hoạt cửa hàng thành công, hãy đăng nhập để bắt đầu sử dụng.",
      });
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      openNotification({
        type: "error",
        title: "Kích hoạt cửa hàng thất bại",
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {contextHolder}
      {activeTab === "register" ? (
        <Row justify="center" style={{ padding: "2rem", height: "100%" }}>
          <Col
            xs={24}
            sm={20}
            md={16}
            lg={12}
            xl={8}
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: 16,
              minWidth: 600,
            }}
          >
            <Title level={3} style={{ textAlign: "center" }}>
              Dùng thử miễn phí 30 ngày
            </Title>
            <Text
              type="secondary"
              style={{
                display: "block",
                textAlign: "center",
                marginBottom: "1.5rem",
              }}
            >
              Để khám phá sản phẩm quản lý bán hàng tốt nhất cho doanh nghiệp
              của bạn
            </Text>
            <Form layout="vertical" onFinish={handleRegisterStore} form={form}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="firstName"
                    rules={[{ required: true, message: "Vui lòng nhập họ" }]}
                  >
                    <Input
                      placeholder="Họ của bạn"
                      size="large"
                      value={form.getFieldValue("firstName")}
                      onChange={(e) => {
                        form.setFieldsValue({ firstName: e.target.value });
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="lastName"
                    rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                  >
                    <Input
                      placeholder="Tên của bạn"
                      size="large"
                      value={form.getFieldValue("lastName")}
                      onChange={(e) => {
                        form.setFieldsValue({ lastName: e.target.value });
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    rules={[
                      { required: true, message: "Vui lòng nhập tên cửa hàng" },
                    ]}
                  >
                    <Input
                      placeholder="Tên cửa hàng của bạn"
                      size="large"
                      value={form.getFieldValue("name")}
                      onChange={(e) => {
                        form.setFieldsValue({ name: e.target.value });
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="province"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn tỉnh/thành phố",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Bạn ở tỉnh/thành phố nào?"
                      size="large"
                      value={form.getFieldValue("province")}
                      onChange={(e) => {
                        form.setFieldsValue({ province: e });
                      }}
                    >
                      {provinces.map((p) => (
                        <Option key={p.label} value={p.label}>
                          {p.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Số điện thoại của bạn"
                      size="large"
                      value={form.getFieldValue("phone")}
                      onChange={(e) => {
                        form.setFieldsValue({ phone: e.target.value });
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    rules={[{ required: true, message: "Vui lòng nhập email" }]}
                  >
                    <Input
                      placeholder="Email của bạn"
                      size="large"
                      value={form.getFieldValue("email")}
                      onChange={(e) => {
                        form.setFieldsValue({ email: e.target.value });
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                <Checkbox
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                >
                  Tôi đã đọc, đồng ý với{" "}
                  <a href="#">Chính sách bảo vệ dữ liệu cá nhân</a> &amp;{" "}
                  <a href="#">Quy định sử dụng</a>
                </Checkbox>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  disabled={!agree}
                  loading={isLoading}
                  style={{
                    borderRadius: 24,
                    background: "linear-gradient(90deg, #00c270, #00a164)",
                    border: "none",
                  }}
                >
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>
            <Divider>hoặc đăng ký bằng</Divider>
            <Row gutter={16} justify="center">
              <Col span={10}>
                <Button
                  icon={<FacebookOutlined />}
                  block
                  style={{
                    background: "#3b5998",
                    color: "#fff",
                    borderRadius: 24,
                  }}
                >
                  Facebook
                </Button>
              </Col>
              <Col span={10}>
                <Button
                  icon={<GoogleOutlined />}
                  block
                  style={{
                    background: "#4285f4",
                    color: "#fff",
                    borderRadius: 24,
                  }}
                >
                  Google
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      ) : (
        <Row justify="center" style={{ padding: "2rem", height: "100%" }}>
          <Col
            xs={24}
            sm={20}
            md={16}
            lg={12}
            xl={8}
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: 16,
              minWidth: 600,
            }}
          >
            <Button
              type="link"
              onClick={() => {
                confirmForm.resetFields();
                setActiveTab("register");
              }}
            >
              {`< Quay lại`}
            </Button>
            <Title level={3} style={{ textAlign: "center" }}>
              Kích hoạt cửa hàng của bạn
            </Title>
            <Text
              type="secondary"
              style={{
                display: "block",
                textAlign: "center",
                marginBottom: "1.5rem",
              }}
            >
              Hãy kiểm tra hòm thư tại email{" "}
              <span style={{ color: "red" }}>
                {form.getFieldValue("email")}
              </span>{" "}
              của bạn để lấy mã xác nhận
            </Text>
            <Form
              layout="vertical"
              onFinish={handleEnableStore}
              form={confirmForm}
            >
              <Form.Item
                name="confirmCode"
                label={<Text style={{ fontSize: 16 }}>Mã xác nhận</Text>}
              >
                <Input placeholder="Nhập mã xác nhận" size="large" />
              </Form.Item>
              <Form.Item
                name="password"
                label={<Text style={{ fontSize: 16 }}>Mật khẩu</Text>}
              >
                <Input.Password placeholder="Nhập mật khẩu" size="large" />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label={<Text style={{ fontSize: 16 }}>Nhập lại mật khẩu</Text>}
              >
                <Input.Password placeholder="Nhập lại mật khẩu" size="large" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={isLoadingEnable}
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
        </Row>
      )}
    </div>
  );
};

export default RegisterStorePage;
