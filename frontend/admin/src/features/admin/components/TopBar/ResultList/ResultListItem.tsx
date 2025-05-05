import { BoxIcon, ReceiptListIcon, UserIcon } from "@/ui-icons";

import { Format } from "app/components/Format";
import { GlobalSearchItemResult, GlobalSearchType } from "app/types";
import { assertUnreachable } from "app/utils/assert";

import { getUrlForItem } from "../utils";

import { Item } from "./Item";

type Props = {
  item: GlobalSearchItemResult;
  selected?: boolean;
  onClick?(): void;
};

export function ResultListItem({ item, selected, onClick }: Props) {
  const url = getUrlForItem(item.id, item.type);
  switch (item.type) {
    case GlobalSearchType.Product:
      return <Item icon={BoxIcon} selected={selected} title={item.data.name} url={url} onClick={onClick} />;
    case GlobalSearchType.Order:
      return (
        <Item
          icon={ReceiptListIcon}
          selected={selected}
          title={`Đơn hàng ${item.data.name}`}
          url={url}
          onClick={onClick}
        >
          <Format.DateTime value={item.data.created_on} />
        </Item>
      );
    case GlobalSearchType.Customer:
      return (
        <Item
          icon={UserIcon}
          selected={selected}
          title={`${item.data.name ? item.data.name : item.data.email}`}
          url={url}
          onClick={onClick}
        >
          {item.data.name ? item.data.email : ""}
        </Item>
      );
    default:
      assertUnreachable(item);
  }
}
