import styled from "@emotion/styled";
import { Button, ButtonGroup, type EmptyStateProps, Stack, Text } from "@/ui-components";

type Props = Pick<EmptyStateProps, "image" | "action" | "heading"> & {
  description?: string;
};

export const EmptyState = ({ action, heading, image, description }: Props) => {
  return (
    <StyledWrapper>
      <img src={image} />
      <Stack vertical alignment="center" distribution="center" spacing="extraTight">
        {heading ? (
          <Text as="h4" variant="headingLg">
            {heading}
          </Text>
        ) : null}
        {description ? (
          <Text as="p" color="subdued">
            {description}
          </Text>
        ) : null}
      </Stack>
      <ButtonGroup>
        {action && (
          <Button primary outline {...action} onClick={action.onAction}>
            {action.content}
          </Button>
        )}
      </ButtonGroup>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${(p) => p.theme.spacing(4)};
  height: 350px;
`;
