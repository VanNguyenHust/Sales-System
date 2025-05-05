import React from "react";

import { Infinite, InfiniteProps } from "./Infinite";
import { Paging, PagingProps } from "./Paging";

export interface PaginationProps extends PagingProps, InfiniteProps {
  /** Set mode phân trang infinite*/
  infinite?: boolean;
}

/**
 * Sử dụng phân trang để cho phép người bán di chuyển qua bộ sưu tập các mặt hàng được sắp xếp theo thứ tự đã được chia thành các trang.
 */
export function Pagination({
  infinite,
  nextURL,
  previousURL,
  hasNext,
  hasPrevious,
  onNext,
  onPrevious,
  numberOfPages,
  currentPage,
  onNavigate,
}: PaginationProps) {
  return infinite ? (
    <Infinite
      nextURL={nextURL}
      previousURL={previousURL}
      onNext={onNext}
      onPrevious={onPrevious}
      hasPrevious={hasPrevious}
      hasNext={hasNext}
    />
  ) : (
    <Paging currentPage={currentPage} numberOfPages={numberOfPages} onNavigate={onNavigate} />
  );
}
