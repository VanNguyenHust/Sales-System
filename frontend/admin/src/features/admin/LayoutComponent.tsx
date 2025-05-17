import React, { useEffect, useState } from "react";
import { Layout, Menu, theme } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { getMenuKeys, menuItemsTop, menuItemsBottom } from "@/types/sider";
import { ProfileMenu } from "@/components/ProfileMenu";

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
      navigate("/admin/dashboard", { replace: true });
    }
  }, [location.pathname, navigate]);

  const { selectedKey, openKeys: calculatedOpenKeys } = getMenuKeys(
    location.pathname,
    menuItemsTop.concat(menuItemsBottom)
  );

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#333334" }}>
      <Sider
        width={200}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth="60"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={
            menuItemsTop[0]?.key ? [menuItemsTop[0].key as string] : []
          }
          inlineCollapsed={collapsed}
          selectedKeys={[selectedKey]}
          openKeys={openKeys.length ? openKeys : calculatedOpenKeys}
          onOpenChange={handleOpenChange}
          items={menuItemsTop}
          onClick={({ key }) => navigate(key)}
        />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={
            menuItemsBottom[0]?.key ? [menuItemsBottom[0].key as string] : []
          }
          inlineCollapsed={collapsed}
          selectedKeys={[selectedKey]}
          openKeys={openKeys.length ? openKeys : calculatedOpenKeys}
          onOpenChange={handleOpenChange}
          items={menuItemsBottom}
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
            left: collapsed ? 60 : 200,
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
          <ProfileMenu />
        </Header>

        <Content
          style={{
            marginTop: "64px",
            padding: "24px 16px",
            overflowY: "auto",
            marginLeft: collapsed ? 60 : 0,
            transition: "margin-left 0.2s",
          }}
        >
          <div
            style={{
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
