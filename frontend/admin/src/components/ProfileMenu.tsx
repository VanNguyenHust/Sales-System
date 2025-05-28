import React from "react";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { useSelector } from "react-redux";
import { StoreInfoState } from "@/client";

export const ProfileMenu: React.FC = () => {
  const { phoneNumber } = useSelector(
    (state: StoreInfoState) => state.storeInfo
  ); // const [logout, { isLoading }] = useLogoutMutation();

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
      <Dropdown menu={{ items }}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            {phoneNumber}
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </>
  );
};
