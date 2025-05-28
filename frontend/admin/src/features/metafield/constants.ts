import { MetafieldDefinitionOwnerResource } from "@/types/metafield";
import { MetafieldDefinitionSource } from "./type";
import {
  AppstoreOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ReactNode } from "react";

export const MetafieldDefinitionSources: MetafieldDefinitionSource[] = [
  {
    title: "Sản phẩm",
    icon: AppstoreOutlined as unknown as ReactNode,
    owner_resource: MetafieldDefinitionOwnerResource.PRODUCT,
  },
  {
    title: "Đơn hàng",
    icon: ShoppingCartOutlined as unknown as ReactNode,
    owner_resource: MetafieldDefinitionOwnerResource.ORDER,
  },
  {
    title: "Khách hàng",
    icon: UserOutlined as unknown as ReactNode,
    owner_resource: MetafieldDefinitionOwnerResource.CUSTOMER,
  },
];

export const OwnerResourceNames: Record<
  MetafieldDefinitionOwnerResource,
  string
> = {
  [MetafieldDefinitionOwnerResource.PRODUCT]: "Sản phẩm",
  [MetafieldDefinitionOwnerResource.ORDER]: "Đơn hàng",
  [MetafieldDefinitionOwnerResource.CUSTOMER]: "Khách hàng",
  [MetafieldDefinitionOwnerResource.VARIANT]: "Biến thể",
  [MetafieldDefinitionOwnerResource.COLLECTION]: "Bộ sưu tập",
};

export function getOwnerResourceName(
  ownerResource: MetafieldDefinitionOwnerResource
) {
  return OwnerResourceNames[ownerResource];
}
