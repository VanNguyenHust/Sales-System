import React from "react";
import { DownOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";

export const ProfileMenu: React.FC = () => {
  // const { contextHolder, openNotification } = useNotification();

  // const [logout, { isLoading }] = useLogoutMutation();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: localStorage.getItem("full_name"),
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Tài khoản của bạn",
      icon: <UserOutlined />,
      onClick: () => {
        window.location.href = "/accounts";
      },
    },
    // {
    //   key: "3",
    //   label: "Đăng xuất",
    //   icon: isLoading ? <LogoutOutlined spin /> : <LogoutOutlined />,
    //   onClick: async () => {
    //     try {
    //       await logout().unwrap();
    //       window.location.href = "/login";
    //       localStorage.clear();
    //     } catch (error) {
    //       openNotification({
    //         type: "error",
    //         message: "Đăng xuất thất bại!",
    //       });
    //     }
    //   },
    // },
  ];

  return (
    <>
      {/* {contextHolder} */}
      <Dropdown menu={{ items }}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            {localStorage.getItem("fullName")}
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </>
  );
};
