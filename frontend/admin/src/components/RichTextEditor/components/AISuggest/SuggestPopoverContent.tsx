import styled from "@emotion/styled";
import { BlockStack, Box, Text } from "@/ui-components";

import { suggestPropertiesMap } from "./constant";
import { useAIContext } from "./context";
import { SuggestBody } from "./SuggestBody";

export const SuggestPopoverContent = () => {
  const { context } = useAIContext();

  const suggestProperties = context ? suggestPropertiesMap[context] : undefined;

  return (
    <BlockStack>
      <StyledSuggestHeader>
        <Text as="span" variant="headingSm">
          {suggestProperties?.title ?? "Tạo nội dung bài viết"}
        </Text>
      </StyledSuggestHeader>
      <Box paddingBlock="4" paddingInline="4">
        <SuggestBody />
      </Box>
    </BlockStack>
  );
};

const StyledSuggestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid #e5e5e5;
  background: #f3f4f5;
  ${(p) => p.theme.breakpoints.down("lg")} {
    display: none;
  }
`;
