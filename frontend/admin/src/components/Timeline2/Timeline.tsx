import React from "react";
import styled from "@emotion/styled";
import { Stack, Text } from "@/ui-components";

import { Col } from "./Col";
import { ColGroup } from "./ColGroup";
import { TimelineItemContext } from "./context";
import { Item } from "./Item";

type TimelineProps = {
  children?: React.ReactNode;
  title?: React.ReactNode;
};

export const Timeline: React.FC<TimelineProps> & {
  Col: typeof Col;
  ColGroup: typeof ColGroup;
  Item: typeof Item;
} = ({ children, title }) => {
  let titleMarkup: React.ReactNode | undefined = undefined;
  if (title) {
    if (typeof title === "string") {
      titleMarkup = <Text as="span">{title}</Text>;
    } else {
      titleMarkup = title;
    }
  }

  return (
    <StyledContainer>
      {titleMarkup}
      <StyledContainerChildren>
        {React.Children.map(children, (child, index) => (
          <TimelineItemContext.Provider value={index === React.Children.count(children) - 1}>
            {child}
          </TimelineItemContext.Provider>
        ))}
      </StyledContainerChildren>
    </StyledContainer>
  );
};

Timeline.Col = Col;
Timeline.ColGroup = ColGroup;
Timeline.Item = Item;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing(4)};
`;

const StyledContainerChildren = styled.div`
  display: flex;
  flex-direction: column;
`;
