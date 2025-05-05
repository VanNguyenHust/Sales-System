import React, { useRef } from "react";
import styled from "@emotion/styled";

import { DestructableAction, DisableableAction } from "../../../types";
import { useComponentDidMount } from "../../../utils/useComponentDidMount";
import { Button } from "../../Button";

export type BulkActionButtonProps = {
  disclosure?: boolean;
  isMoreAction?: boolean;
  moreActionPressed?: boolean;
  handleMeasurement?(width: number): void;
} & DisableableAction &
  DestructableAction;

export function BulkActionButton({
  handleMeasurement,
  isMoreAction,
  moreActionPressed,
  url,
  external,
  onAction,
  content,
  disclosure,
  disabled,
  destructive,
}: BulkActionButtonProps) {
  const bulkActionButton = useRef<HTMLDivElement>(null);

  useComponentDidMount(() => {
    if (handleMeasurement && bulkActionButton.current) {
      const width = bulkActionButton.current.getBoundingClientRect().width;
      handleMeasurement(width);
    }
  });

  const buttonMarkup = (
    <Button
      external={external}
      url={url}
      disclosure={disclosure}
      onClick={onAction}
      disabled={disabled}
      destructive={destructive}
      plain={!isMoreAction}
      pressed={moreActionPressed}
    >
      {content}
    </Button>
  );

  return <StyledBulkActionButton ref={bulkActionButton}>{buttonMarkup}</StyledBulkActionButton>;
}

const StyledBulkActionButton = styled.div`
  white-space: nowrap;
  button {
    display: flex;
  }
`;
