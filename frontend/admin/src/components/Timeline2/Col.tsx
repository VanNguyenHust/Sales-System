import styled from "@emotion/styled";
import { Button, ButtonGroup, Collapsible, type ComplexAction, Icon, useBreakpoints } from "@/ui-components";
import { ArrowChevronDownIcon, ArrowChevronUpIcon } from "@/ui-icons";

import { useToggle } from "app/utils/useToggle";

export interface ColProps {
  children?: React.ReactNode;
  width?: string;
  collapsibleContent?: React.ReactNode;
  action?: ComplexAction;
}
export const Col = ({ children, width, collapsibleContent, action }: ColProps) => {
  const { value: isOpenMetaData, toggle: toggleOpenMetaData } = useToggle(false);
  const { mdDown } = useBreakpoints();

  return (
    <StyledCol width={(!mdDown && width) || undefined}>
      <StyledCollapsible>
        <StyledColWrapper>
          {children}
          {(collapsibleContent || action) && (
            <Button
              plain
              onClick={toggleOpenMetaData}
              icon={isOpenMetaData ? ArrowChevronUpIcon : ArrowChevronDownIcon}
            />
          )}
        </StyledColWrapper>
        <Collapsible open={isOpenMetaData} transition>
          {collapsibleContent && <StyledCollapsibleContent>{collapsibleContent}</StyledCollapsibleContent>}
          {action && (
            <StyledAction>
              <Button primary outline {...action} onClick={action.onAction}>
                {action.content}
              </Button>
            </StyledAction>
          )}
        </Collapsible>
      </StyledCollapsible>
    </StyledCol>
  );
};

const StyledCol = styled.div<{ width?: string }>`
  display: flex;
  width: ${(p) => p.width};
  flex: ${(p) => !p.width && "1"};
`;
const StyledCollapsible = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const StyledColWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const StyledCollapsibleContent = styled.div`
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  background: ${(p) => p.theme.colors.surfaceSubdued};
  padding: ${(p) => p.theme.spacing(3)};
  margin-top: ${(p) => p.theme.spacing(2)};
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing(3)};
`;

const StyledAction = styled.div`
  margin-top: ${(p) => p.theme.spacing(2)};
`;
