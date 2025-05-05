import { useMemo } from "react";
import { matchPath } from "react-router-dom";
import styled from "@emotion/styled";
import { Badge, Navigation, Tooltip } from "@/ui-components";
import {
  BoxIcon,
  ChartBarAltIcon,
  DeliveryIcon,
  HomeRoofIcon,
  NoteIcon,
  PromotionIcon,
  ReceiptListIcon,
  SettingsIcon,
  UserIcon,
  WarehouseIcon,
} from "@/ui-icons";

import { usePermission } from "app/features/auth/usePermission";
import { useSearchOrderCountForNavbarQuery } from "app/features/order/api";
import { useSelector } from "app/types";
import { filterNonNull } from "app/utils/arrays";
import { PackageName } from "app/utils/package";
import { useFeatureFlag } from "app/utils/useFeatureFlag";
import { useTenant } from "app/utils/useTenant";

import { AppSection } from "./AppSection";
import { ChannelSection } from "./ChannelSection";
import { SocialSection } from "./SocialSection";
import { NavigationItemProps, NavigationSubItemProps } from "./types";

export function NavBar() {
  const pathname = useSelector((state) => state.appBridge.clientRoutingLocation?.pathname ?? state.ui.locationPathname);

  const { formatNumber } = useTenant();
  const { isEnabledFeature } = useFeatureFlag();
  const tenant = useSelector((state) => state.tenant);
  const { hasSomePermissions } = usePermission();
  const { data: orderCount = 0 } = useSearchOrderCountForNavbarQuery(
    {
      statuses: "open",
      query:
        "financial_status:(authorized OR pending OR partial_paid) OR (NOT EXISTS:financial_status) OR fulfillment_status:(partial) OR (NOT EXISTS:fulfillment_status)",
    },
    { skip: !hasSomePermissions(["read_orders", "read_assigned_orders"]) }
  );

  const isMatchReportList = useMemo(() => {
    return (
      (!!matchPath("/admin/reports/*", pathname) && !matchPath("/admin/reports", pathname)) ||
      !!matchPath("/admin/trackings/*", pathname)
    );
  }, [pathname]);

  const orderItems: NavigationSubItemProps[] = [
    {
      url: "/admin/orders",
      label: "Danh sách đơn hàng",
      disabled: !hasSomePermissions(["read_orders", "read_assigned_orders"]),
    },
    {
      url: "/admin/draft_orders",
      label: "Đơn hàng nháp",
      disabled: !hasSomePermissions(["read_draft_orders"]),
    },
    {
      url: "/admin/order_returns",
      label: "Trả hàng",
      disabled: !hasSomePermissions(["read_returns"]),
    },
    {
      url: "/admin/checkouts",
      label: "Đơn chưa hoàn tất",
      disabled: !hasSomePermissions(["abandoned_checkouts"]),
    },
  ];

  const productItems: NavigationSubItemProps[] = filterNonNull<NavigationSubItemProps>([
    {
      url: "/admin/products",
      label: "Danh sách sản phẩm",
      disabled: !hasSomePermissions(["read_products"]),
    },
    {
      url: "/admin/collections",
      label: "Danh mục sản phẩm",
      disabled: !hasSomePermissions(["collections"]),
    },
    isEnabledFeature("manage_catalogs")
      ? {
          url: "/admin/catalogs",
          label: "Bảng giá",
          disabled: !hasSomePermissions(["read_products"]),
        }
      : null,
  ]);

  const simpleInventoryManagement = tenant.settings?.some(
    (item) => item.setting_key === "inventory_management" && item.setting_value === "simple"
  );

  const inventoryItems: NavigationSubItemProps[] = simpleInventoryManagement
    ? [
        {
          url: "/admin/inventories",
          label: "Tồn kho",
          disabled: !hasSomePermissions(["read_inventories"]),
        },
      ]
    : [
        {
          url: "/admin/inventories",
          label: "Tồn kho",
          disabled: !hasSomePermissions(["read_inventories"]),
        },
        {
          url: "/admin/purchase_orders",
          label: "Đặt hàng nhập",
          disabled: !hasSomePermissions(["purchase_orders"]),
        },
        {
          url: "/admin/receive_inventories",
          label: "Nhập hàng",
          disabled: !hasSomePermissions(["receive_inventories"]),
        },
        {
          url: "/admin/supplier_returns",
          label: "Trả hàng nhập",
          disabled: !hasSomePermissions(["supplier_returns"]),
        },
        {
          url: "/admin/stock_transfers",
          label: "Chuyển kho",
          disabled: !hasSomePermissions(["stock_transfers"]),
        },
        {
          url: "/admin/suppliers",
          label: "Nhà cung cấp",
          disabled: !hasSomePermissions(["suppliers"]),
        },
      ];

  const customerItems: NavigationSubItemProps[] = [
    {
      url: "/admin/customers",
      label: "Khách hàng",
      disabled: !hasSomePermissions(["read_customers"]),
    },
    {
      url: "/admin/customer_groups",
      label: "Nhóm khách hàng",
      disabled: !hasSomePermissions(["read_customers"]),
    },
  ];

  const reportItems: NavigationSubItemProps[] = filterNonNull<NavigationSubItemProps>([
    {
      url: "/admin/reports",
      excludePaths: ["/admin/reports/*"],
      exactMatch: true,
      label: "Tổng quan báo cáo",
      disabled: !hasSomePermissions([
        "reports",
        "customer_reports",
        "inventory_reports",
        "sale_reports",
        "visit_reports",
      ]),
    },
    {
      url: "/admin/reports/list",
      matches: isMatchReportList,
      label: "Danh sách báo cáo",
      disabled: !hasSomePermissions([
        "reports",
        "customer_reports",
        "inventory_reports",
        "sale_reports",
        "payment_reports",
        "visit_reports",
      ]),
    },
  ]);

  const shipmentsItems: NavigationSubItemProps[] = [
    {
      url: "/admin/shipments/reports",
      label: "Tổng quan",
      disabled: !hasSomePermissions(["read_orders", "read_assigned_orders", "shipments"]),
    },
    {
      url: "/admin/shipments",
      excludePaths: ["/admin/shipments/reports"],
      label: "Vận đơn",
      disabled: !hasSomePermissions(["read_orders", "read_assigned_orders", "shipments"]),
    },
  ];

  const isEwebV3 = tenant.settings?.some(
    (item) => item.setting_key === "RegisterPackageTitle" && item.setting_value === "eweb_v3"
  );

  return (
    <Navigation location={pathname}>
      <Navigation.Section
        items={filterNonNull<NavigationItemProps>([
          {
            url: "/admin/dashboard",
            label: "Tổng quan",
            icon: HomeRoofIcon,
            disabled: !hasSomePermissions(["dashboard"]),
          },
          isEnabledFeature("manage_orders")
            ? {
                url: orderItems.find(isEnableItem)?.url,
                label: "Đơn hàng",
                icon: ReceiptListIcon,
                badge:
                  hasSomePermissions(["read_orders", "read_assigned_orders"]) && orderCount ? (
                    <StyledCount>
                      <Tooltip content="Đơn hàng đang xử lý" hoverDelay={500}>
                        <Badge size="small" status="plain">
                          {formatNumber(orderCount)}
                        </Badge>
                      </Tooltip>
                    </StyledCount>
                  ) : undefined,
                disabled: orderItems.every(isDisableItem),
                subNavigationItems: orderItems,
              }
            : null,
          {
            url: "/admin/shipments/reports",
            label: "Vận chuyển",
            icon: DeliveryIcon,
            disabled: shipmentsItems.every(isDisableItem),
            subNavigationItems: shipmentsItems,
          },
          {
            url: productItems.find(isEnableItem)?.url,
            label: "Sản phẩm",
            icon: BoxIcon,
            disabled: productItems.every(isDisableItem),
            subNavigationItems: productItems,
          },
          {
            url: inventoryItems.find(isEnableItem)?.url,
            label: "Quản lý kho",
            icon: WarehouseIcon,
            disabled: inventoryItems.every(isDisableItem),
            subNavigationItems: inventoryItems.length > 1 ? inventoryItems : undefined,
          },
          {
            url: customerItems.find(isEnableItem)?.url,
            label: "Khách hàng",
            icon: UserIcon,
            disabled: customerItems.every(isDisableItem),
            subNavigationItems: customerItems,
          },
          isEnabledFeature("manage_discounts")
            ? {
                url: "/admin/discounts",
                label: "Khuyến mại",
                icon: PromotionIcon,
                disabled: !hasSomePermissions(["read_price_rules", "marketing"]),
              }
            : null,
          isEnabledFeature("manage_cash_journal")
            ? {
                url: `/admin/vouchers`,
                label: "Sổ quỹ",
                icon: NoteIcon,
                disabled: !hasSomePermissions(["read_vouchers"]),
              }
            : null,
          {
            label: "Báo cáo",
            icon: ChartBarAltIcon,
            url: reportItems.find(isEnableItem)?.url,
            disabled: reportItems.every(isDisableItem),
            subNavigationItems: reportItems,
          },
        ])}
      />
      <StyledMiddle>
        {!(isEwebV3 && PackageName.OMNI_TRIAL_V3 === tenant?.tenant?.plan_name) &&
          isEnabledFeature("use_social_channel") && <SocialSection />}
        <ChannelSection />
        {hasSomePermissions(["applications", "limited_applications"]) && <AppSection />}
      </StyledMiddle>
      <StyledBottom>
        <Navigation.Section
          items={[
            {
              url: "/admin/settings",
              label: "Cấu hình",
              icon: SettingsIcon,
              matchPaths: ["/admin/channels"],
              excludePaths: ["/admin/settings/redirects", "/admin/settings/domains"],
              disabled: !hasSomePermissions([
                "channels",
                "store_settings",
                "location_settings",
                "plans_settings",
                "notifications",
                "files",
                "shipping_settings",
                "tax_settings",
                "payment_settings",
                "checkout_settings",
                "user_permissions",
                "applications",
                "limited_applications",
                "dashboard",
                "read_carriers",
                "write_carriers",
                // for metafield setting
                "read_products",
                "collections",
                "read_orders",
                "read_assigned_orders",
              ]),
            },
          ]}
          separator
        />
      </StyledBottom>
    </Navigation>
  );
}

function isDisableItem(item: NavigationSubItemProps) {
  return item.disabled;
}

function isEnableItem(item: NavigationSubItemProps) {
  return !item.disabled;
}

const StyledBottom = styled.div`
  position: sticky;
  bottom: 0;
  background: ${(p) => p.theme.components.navigation.backgroundColor};
`;

const StyledMiddle = styled.div`
  flex: 1 0 auto;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const StyledCount = styled.span`
  display: flex;
  > span {
    display: flex;
  }
`;
