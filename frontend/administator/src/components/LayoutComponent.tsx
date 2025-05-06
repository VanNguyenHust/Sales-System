import React, { useEffect, useState } from "react";
import { Layout, Menu, theme } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getMenuKeys, menuItems } from "../types/sider";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const { Header, Content, Sider } = Layout;

export const LayoutComponent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/dashboard", { replace: true });
    }
  }, [location.pathname, navigate]);

  const { selectedKey, openKeys: calculatedOpenKeys } = getMenuKeys(
    location.pathname,
    menuItems
  );

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={200}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          overflow: "auto",
        }}
      >
        <div className="demo-logo-vertical"></div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={
            menuItems[0]?.key ? [menuItems[0].key as string] : []
          }
          selectedKeys={[selectedKey]}
          openKeys={openKeys.length ? openKeys : calculatedOpenKeys}
          onOpenChange={handleOpenChange}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout
        style={{ marginLeft: collapsed ? 0 : 200, transition: "margin 0.2s" }}
      >
        <Header
          style={{
            position: "fixed",
            top: 0,
            left: collapsed ? 0 : 200,
            right: 0,
            height: "64px",
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 16px",
            zIndex: 1000,
            transition: "left 0.2s",
          }}
        >
          <span
            onClick={() => setCollapsed(!collapsed)}
            style={{ cursor: "pointer", fontSize: "18px", marginRight: "16px" }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>
          {/* <ProfileMenu /> */}
        </Header>

        <Content
          style={{
            marginTop: "64px",
            padding: "24px 16px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              padding: "8px 24px",
              gap: "16px",
              height: "100%",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
