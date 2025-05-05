import styled from "@emotion/styled";
import { ActionList, type ActionListProps, Icon, Popover, Stack, Text } from "@/ui-components";
import { ArrowCaretDownIcon, ArrowCaretUpIcon } from "@/ui-icons";

import { useToggle } from "app/utils/useToggle";

type Props = {
  title?: string;
  actionTitle: string;
  actions: ActionListProps["items"];
};

export const PageTitleMetadata = ({ title, actionTitle, actions }: Props) => {
  const { value: openPopover, toggle: toggleOpenPopover, setFalse: toggleClosePopover } = useToggle(false);

  return (
    <Stack>
      {title && (
        <Text as="span" fontWeight="semibold" variant="headingLg">
          {actionTitle && actions ? `${title}: ` : title}
        </Text>
      )}
      {actionTitle && actions && (
        <Popover
          activator={
            <StyledButtonOption onClick={toggleOpenPopover}>
              <Text as="span" fontWeight="semibold" variant="headingLg" truncate>
                {actionTitle}
              </Text>
              <Icon
                source={openPopover ? ArrowCaretUpIcon : ArrowCaretDownIcon}
                color={openPopover ? "primary" : "base"}
              />
            </StyledButtonOption>
          }
          active={openPopover}
          onClose={toggleClosePopover}
        >
          <Popover.Pane>
            <StyledActionList>
              <ActionList items={actions} onActionAnyItem={toggleClosePopover} />
            </StyledActionList>
          </Popover.Pane>
        </Popover>
      )}
    </Stack>
  );
};

const StyledButtonOption = styled.span`
  display: flex;
  cursor: pointer;
  height: 36px;
  padding: ${(p) => p.theme.spacing(0, 3)};
  align-items: center;
  margin-left: -${(p) => p.theme.spacing(3)};
  margin-top: -3px;
  :hover {
    background: #f1f1f1 !important;
    box-shadow: none !important;
    border-radius: ${(p) => p.theme.shape.borderRadius("base")} !important;
    color: #0f1824;
  }
`;

const StyledActionList = styled.div`
  li {
    min-width: ${(p) => p.theme.spacing(24)};
  }
  button {
    text-align: center;
  }
`;
