import styled from "@emotion/styled";
import { IndexTable as UIIndexTable, type IndexTableProps } from "@/ui-components";

import { Pagination, PaginationProps } from "../Pagination";

import { EmptySearchResult } from "./EmptySearchResult";

type Props = IndexTableProps & {
  pagination?: PaginationProps;
};

export function IndexTable({ pagination, emptyState, ...indexTableProps }: Props) {
  const { itemCount } = indexTableProps;
  if (!itemCount) {
    return emptyState ? emptyState : <EmptySearchResult />;
  }
  return (
    <StyledWrapper>
      <StyledTable>
        <UIIndexTable {...indexTableProps} />
      </StyledTable>
      {pagination && (
        <StyledPagination>
          <Pagination {...pagination} />
        </StyledPagination>
      )}
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const StyledTable = styled.div`
  flex: 1;
`;

const StyledPagination = styled.div`
  position: sticky;
  z-index: ${(p) => p.theme.zIndex.indexTableScrollBar - 1};
  bottom: 0;
  background-color: ${(p) => p.theme.colors.surface};
  padding: ${(p) => p.theme.spacing(3, 4)};
`;
