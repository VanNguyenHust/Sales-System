import { useCallback } from "react";
import styled from "@emotion/styled";
import {
  Pagination as UIPagination,
  Select2,
  type Select2Props,
  Stack,
  Text,
  useBreakpoints,
} from "@/ui-components";

import { useSelector } from "app/types";

export interface PaginationProps {
  /**
   * @default "true"
   */
  hideWhenNoPage?: boolean;
  totalCount: number;
  currentPage: number;
  perPage: number;
  onNavigate?(value: number): void;
  onChangePerPage?(value: number): void;
  /**
   * @default "medium"
   */
  pageSize?: "medium" | "large";
  /**
   * @deprecated using pageSize instead
   */
  pageSizeOptions?: Select2Props["options"];
  hidePageSize?: boolean;
  disabledScrollTo?: boolean;
}

export function Pagination({
  totalCount,
  perPage,
  currentPage,
  hideWhenNoPage = true,
  onChangePerPage,
  onNavigate,
  pageSize = "medium",
  pageSizeOptions,
  hidePageSize,
  disabledScrollTo,
}: PaginationProps) {
  const { smUp, mdUp, lgDown } = useBreakpoints();
  const { navbarCollapsed } = useSelector((state) => state.ui);
  const totalPages = Math.ceil(totalCount / perPage);
  const handleChangePerPage = useCallback(
    (value: string) => {
      !disabledScrollTo && window.scrollTo({ top: 0, behavior: "smooth" });
      onChangePerPage?.(parseInt(value));
    },
    [disabledScrollTo, onChangePerPage]
  );

  const handleNext = useCallback(() => {
    !disabledScrollTo && window.scrollTo({ top: 0, behavior: "smooth" });
    onNavigate?.(currentPage + 1);
  }, [currentPage, disabledScrollTo, onNavigate]);

  const handlePrevious = useCallback(() => {
    !disabledScrollTo && window.scrollTo({ top: 0, behavior: "smooth" });
    onNavigate?.(currentPage - 1);
  }, [currentPage, disabledScrollTo, onNavigate]);

  const handleNavigate = useCallback(
    (value: number) => {
      !disabledScrollTo && window.scrollTo({ top: 0, behavior: "smooth" });
      onNavigate?.(value);
    },
    [disabledScrollTo, onNavigate]
  );

  let options: Select2Props["options"];
  if (pageSizeOptions) {
    options = pageSizeOptions;
  } else if (pageSize === "large") {
    options = [
      { label: "20", value: "20" },
      { label: "50", value: "50" },
      { label: "100", value: "100" },
    ];
  } else {
    options = [
      { label: "20", value: "20" },
      { label: "50", value: "50" },
    ];
  }
  const firstItem = currentPage === 1 ? 1 : (currentPage - 1) * perPage + 1;
  const lastItem = currentPage === totalPages ? totalCount : perPage * currentPage;
  if (hideWhenNoPage && totalCount === 0) {
    return null;
  }
  if (mdUp && lgDown && !navbarCollapsed) {
    return (
      <StyledPagination>
        <UIPagination currentPage={currentPage} onNavigate={handleNavigate} numberOfPages={totalPages} />
      </StyledPagination>
    );
  }
  if (mdUp) {
    return (
      <Stack alignment="center" wrap={false}>
        <Text as="span">
          Từ {firstItem} đến {lastItem} trên tổng {totalCount}
        </Text>
        <Stack.Item fill>
          {!hidePageSize ? (
            <Stack alignment="center" spacing="tight" distribution="center">
              <Text as="span">Hiển thị</Text>
              <Select2 value={`${perPage}`} options={options} onChange={handleChangePerPage} />
              <Text as="span">Kết quả</Text>
            </Stack>
          ) : null}
        </Stack.Item>
        <UIPagination currentPage={currentPage} onNavigate={handleNavigate} numberOfPages={totalPages} />
      </Stack>
    );
  }
  if (smUp) {
    return (
      <StyledPagination>
        <UIPagination currentPage={currentPage} onNavigate={handleNavigate} numberOfPages={totalPages} />
      </StyledPagination>
    );
  }
  return (
    <StyledPagination>
      <UIPagination
        infinite
        hasNext={currentPage !== totalPages}
        hasPrevious={currentPage !== 1}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </StyledPagination>
  );
}

const StyledPagination = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
