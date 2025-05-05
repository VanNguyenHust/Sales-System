import styled from "@emotion/styled";
import { SkeletonBodyText, Stack } from "@/ui-components";

interface Props {
  /**
   * Số cột
   * @default 5
   */
  headings?: number;
  /**
   * Số dòng
   * @default 10
   */
  rows?: number;
  /**
   * Có bộ lọc
   * @default false
   */
  filters?: boolean;
  /**
   * Bảng có cho chọn
   * @default true
   */
  selectable?: boolean;
}

export function SkeletonTable({ headings: headingsProp = 5, rows: rowsProp = 10, filters, selectable = true }: Props) {
  const rows: JSX.Element[] = [];

  for (let row = 0; row < rowsProp; row++) {
    const cols: JSX.Element[] = [];
    if (selectable) {
      cols.push(
        <StyledCellFirst key={`${row}-prefix`}>
          <StyledSkeletonCheckbox />
        </StyledCellFirst>
      );
    }

    for (let col = 0; col < headingsProp; col++) {
      cols.push(
        <StyledCell key={col}>
          <SkeletonBodyText lines={1} />
        </StyledCell>
      );
    }
    rows.push(<StyledRow key={row}>{cols}</StyledRow>);
  }

  return (
    <Stack vertical>
      {filters ? (
        <StyledFilter>
          <StyledFilterInput />
          <StyledFilterAction />
        </StyledFilter>
      ) : null}
      <StyledTable>
        <tbody>{rows}</tbody>
      </StyledTable>
    </Stack>
  );
}

const StyledTable = styled.table`
  width: 100%;
  min-width: 100%;
  border-collapse: collapse;
`;

const StyledRow = styled.tr`
  background-color: ${(p) => p.theme.colors.surface};
  border-top: ${(p) => p.theme.shape.borderDivider};
`;

const StyledCell = styled.td`
  padding: calc((${(p) => p.theme.spacing(10)} - ${(p) => p.theme.spacing(2)}) / 2) ${(p) => p.theme.spacing(4)};
  height: ${(p) => p.theme.spacing(10)};
`;

const StyledCellFirst = styled.td`
  width: ${(p) => p.theme.spacing(5)};
  padding-left: 0;
  padding-right: ${(p) => p.theme.spacing(4)};
  padding-top: calc((${(p) => p.theme.spacing(10)} - ${(p) => p.theme.spacing(5)}) / 2);
  padding-bottom: calc((${(p) => p.theme.spacing(10)} - ${(p) => p.theme.spacing(5)}) / 2);
  vertical-align: middle;
`;

const StyledSkeletonCheckbox = styled.div`
  display: inline-block;
  height: ${(p) => p.theme.spacing(5)};
  width: ${(p) => p.theme.spacing(5)};
  background-color: ${(p) => p.theme.colors.backgroundStrong};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
`;

const StyledFilter = styled.div`
  display: flex;
  gap: ${(p) => p.theme.spacing(4)};
  justify-content: space-between;
`;

const StyledFilterInput = styled.div`
  flex: 1;
  background: ${(p) => p.theme.colors.backgroundHoverred};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  min-height: ${(p) => p.theme.components.form.controlHeight};
`;

const StyledFilterAction = styled.div`
  background: ${(p) => p.theme.colors.backgroundHoverred};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  min-height: ${(p) => p.theme.components.form.controlHeight};
  min-width: 6.25rem;
`;
