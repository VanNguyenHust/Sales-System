import React from "react";
import styled from "@emotion/styled";

import { GlobalSearchItemResult, GlobalSearchType } from "app/types";

import { Item } from "./Item";
import { ResultListItem } from "./ResultListItem";

type Props = {
  items: GlobalSearchItemResult[];
  selected?: number;
  loading?: boolean;
  moreCount?: number;
  hasMore?: boolean;
  onLoadMore?(): void;
  onItemClick?(id: number, type: GlobalSearchType): void;
};

export function ResultList({ items, selected, loading, moreCount = 10, hasMore, onLoadMore, onItemClick }: Props) {
  const itemsMarkup = items.map((item, index) => (
    <React.Fragment key={`${item.type}-${item.id}`}>
      <ResultListItem
        item={item}
        selected={selected ? selected === item.id : undefined}
        onClick={() => onItemClick?.(item.id, item.type)}
      />
      {index !== items.length - 1 ? <StyledDivider /> : null}
    </React.Fragment>
  ));
  if (hasMore) {
    return (
      <>
        {itemsMarkup}
        <StyledDivider loadMore />
        <Item
          selected={selected === -1}
          hasMore
          loading={loading}
          onClick={onLoadMore}
          title={`Hiển thị thêm ${moreCount} kết quả`}
        />
      </>
    );
  } else {
    return <>{itemsMarkup}</>;
  }
}

const StyledDivider = styled.div<{
  loadMore?: boolean;
}>`
  margin-top: ${(p) => (p.loadMore ? 0 : p.theme.spacing(2))};
  margin-bottom: ${(p) => p.theme.spacing(2)};
  border-top: ${(p) => (p.loadMore ? "none" : p.theme.shape.borderDivider)};
`;
