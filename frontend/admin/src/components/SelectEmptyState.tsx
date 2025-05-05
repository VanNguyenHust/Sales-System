import styled from "@emotion/styled";
import { Text } from "@/ui-components";

interface Props {
  content?: string;
}
export const SelectEmptyState = ({ content = "Không có kết quả tìm kiếm" }: Props) => {
  return (
    <StyledEmptyState>
      <Text as="p" alignment="center">
        {content}
      </Text>
    </StyledEmptyState>
  );
};

const StyledEmptyState = styled.div`
  padding: ${(p) => p.theme.spacing(3)};
`;
