import { ComponentProps, CSSProperties } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { IndexTable, type IndexTableProps } from "@/ui-components";

type CellProps = ComponentProps<typeof IndexTable.Cell>;

interface OwnProps {
  alignment?: IndexTableProps["headings"][number]["alignment"];
  width?: number;
  maxWidth?: number;
  pointerEvents?: CSSProperties["pointerEvents"];
  minWidth?: number;
  whiteSpace?: CSSProperties["whiteSpace"];
}

interface Props extends Pick<CellProps, "flush" | "children">, OwnProps {}

export function IndexTableCell(props: Props) {
  return <StyledCell {...props} />;
}

const StyledCell = styled(IndexTable.Cell)<OwnProps>`
  text-align: ${(p) => (p.alignment ? p.alignment : "left")};
  pointer-events: ${(p) => (p.pointerEvents ? p.pointerEvents : "inherit")};

  ${(p) =>
    p.width
      ? css`
          width: ${p.width}px;
        `
      : css``};
  ${(p) =>
    p.maxWidth
      ? css`
          max-width: ${p.maxWidth}px;
        `
      : css``};
  ${(p) =>
    p.minWidth
      ? css`
          min-width: ${p.minWidth}px;
        `
      : css``};
  ${(p) =>
    p.whiteSpace
      ? css`
          white-space: ${p.whiteSpace};
        `
      : css``}
`;
