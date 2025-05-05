import { Box, Card, EmptyState, type EmptyStateProps } from "@/ui-components";

export const IndexEmptyState = ({ backdrop = true, ...restProps }: EmptyStateProps) => {
  return (
    <Card>
      <Box height="75vh">
        <EmptyState backdrop={backdrop} {...restProps} />
      </Box>
    </Card>
  );
};
