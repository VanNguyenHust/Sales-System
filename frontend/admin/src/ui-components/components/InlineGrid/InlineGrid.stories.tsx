import React from "react";
import styled from "@emotion/styled";
import type { Meta, StoryObj } from "@storybook/react";

import { Text } from "../Text";

import { InlineGrid, InlineGridProps } from "./InlineGrid";

const meta: Meta<typeof InlineGrid> = {
  title: "InlineGrid",
  component: InlineGrid,
  argTypes: {
    gap: {
      options: [
        "0",
        "025",
        "05",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "8",
        "10",
        "12",
        "16",
        "20",
        "24",
        "28",
        "32",
      ] satisfies InlineGridProps["gap"][],
    },
  },
};

export default meta;

type Story = StoryObj<typeof InlineGrid>;

export const Basic: Story = {
  render(args) {
    return (
      <InlineGrid {...args}>
        <Placeholder height="320px" />
        <Placeholder height="320px" />
        <Placeholder height="320px" />
      </InlineGrid>
    );
  },
  args: {
    columns: 3,
    gap: "4",
  },
};

export const WithColumnWidth: Story = {
  render(args) {
    return (
      <InlineGrid {...args}>
        <Placeholder height="320px" label="oneThird" />
        <Placeholder height="320px" label="twoThirds" />
      </InlineGrid>
    );
  },
  args: {
    columns: ["oneThird", "twoThirds"],
    gap: "4",
  },
};

type PlaceholderProps = {
  width?: string;
  height?: string;
  minHeight?: string;
  label?: string;
};

function Placeholder({ width, height, minHeight, label }: PlaceholderProps) {
  const labelMarkup = label ? (
    <Text as="span" variant="bodySm" fontWeight="bold">
      <span style={{ color: "white" }}>{label}</span>
    </Text>
  ) : undefined;
  return <StyledBox style={{ width, height, minHeight }}>{labelMarkup}</StyledBox>;
}

const StyledBox = styled.div`
  background: ${(p) => p.theme.colors.textHighlight};
  border: ${(p) => p.theme.shape.borderDivider};
  padding: ${(p) => p.theme.spacing(4)};
`;
