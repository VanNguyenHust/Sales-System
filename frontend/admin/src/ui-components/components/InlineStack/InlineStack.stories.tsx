import React from "react";
import styled from "@emotion/styled";
import type { Meta, StoryObj } from "@storybook/react";

import { Divider } from "../Divider";
import { Page } from "../Page";
import { Stack } from "../Stack";
import { Text } from "../Text";

import { InlineStack, InlineStackProps } from "./InlineStack";

const meta: Meta<typeof InlineStack> = {
  title: "InlineStack",
  component: InlineStack,
  argTypes: {
    direction: {
      options: ["row", "row-reverse"] satisfies InlineStackProps["direction"][],
    },
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
      ] satisfies InlineStackProps["gap"][],
    },
  },
};

export default meta;

type Story = StoryObj<typeof InlineStack>;

export const Basic: Story = {
  render(args) {
    return (
      <InlineStack {...args}>
        <Placeholder width="106px" height="36px" />
        <Placeholder width="106px" height="20px" />
        <Placeholder width="106px" height="20px" />
        <Placeholder width="106px" height="20px" />
        <Placeholder width="106px" height="20px" />
        <Placeholder width="106px" height="20px" />
      </InlineStack>
    );
  },
};

export const WithGap: Story = {
  render(args) {
    return (
      <InlineStack {...args}>
        <Placeholder width="106px" height="36px" />
        <Placeholder width="106px" height="20px" />
        <Placeholder width="106px" height="20px" />
        <Placeholder width="106px" height="20px" />
        <Placeholder width="106px" height="20px" />
        <Placeholder width="106px" height="20px" />
      </InlineStack>
    );
  },
  args: {
    gap: "4",
  },
};

export const WithBlockAlign: Story = {
  render() {
    return (
      <Stack vertical>
        <InlineStack blockAlign="start">
          <Placeholder width="106px" label="Start" />
          <Placeholder width="106px" height="20px" />
          <Placeholder width="106px" height="20px" />
          <Placeholder width="106px" height="20px" />
          <Placeholder width="106px" height="20px" />
          <Placeholder width="106px" height="20px" />
        </InlineStack>
        <Divider />
        <InlineStack blockAlign="center">
          <Placeholder width="106px" label="Center" />
          <Placeholder width="106px" height="20px" />
          <Placeholder width="106px" height="20px" />
          <Placeholder width="106px" height="20px" />
          <Placeholder width="106px" height="20px" />
          <Placeholder width="106px" height="20px" />
        </InlineStack>
        <Divider />
        <InlineStack blockAlign="end">
          <Placeholder width="106px" label="End" />
          <Placeholder width="106px" height="20px" />
          <Placeholder width="106px" height="20px" />
          <Placeholder width="106px" height="20px" />
          <Placeholder width="106px" height="20px" />
          <Placeholder width="106px" height="20px" />
        </InlineStack>
        <Divider />
        <InlineStack blockAlign="baseline">
          <Placeholder width="106px" label="Baseline" />
          <Placeholder width="106px" slim label="text" />
          <Placeholder width="106px" slim label="text" />
          <Placeholder width="106px" slim label="text" />
          <Placeholder width="106px" slim label="text" />
          <Placeholder width="106px" slim label="text" />
        </InlineStack>
        <Divider />
        <InlineStack blockAlign="stretch">
          <Placeholder width="106px" label="Stretch" />
          <Placeholder width="106px" minHeight="20px" />
          <Placeholder width="106px" minHeight="20px" />
          <Placeholder width="106px" minHeight="20px" />
          <Placeholder width="106px" minHeight="20px" />
          <Placeholder width="106px" minHeight="20px" />
        </InlineStack>
      </Stack>
    );
  },
};

export const WidthAlign: Story = {
  render() {
    return (
      <Page narrowWidth>
        <Stack vertical>
          <InlineStack align="start">
            <Placeholder width="106px" label="Start" />
            <Placeholder width="106px" height="20px" />
            <Placeholder width="106px" height="20px" />
            <Placeholder width="106px" height="20px" />
            <Placeholder width="106px" height="20px" />
            <Placeholder width="106px" height="20px" />
            <Placeholder width="106px" height="20px" />
          </InlineStack>
          <Divider />
          <InlineStack align="center">
            <Placeholder width="106px" label="Center" />
            <Placeholder width="106px" height="20px" />
            <Placeholder width="106px" height="20px" />
            <Placeholder width="106px" height="20px" />
            <Placeholder width="106px" height="20px" />
            <Placeholder width="106px" height="20px" />
            <Placeholder width="106px" height="20px" />
          </InlineStack>
          <Divider />
          <InlineStack align="end">
            <Placeholder width="106px" label="End" />
            <Placeholder width="106px" height="20px" />
            <Placeholder width="106px" height="20px" />
            <Placeholder width="106px" height="20px" />
            <Placeholder width="106px" height="20px" />
            <Placeholder width="106px" height="20px" />
            <Placeholder width="106px" height="20px" />
          </InlineStack>
        </Stack>
      </Page>
    );
  },
};

export const WithDirection: Story = {
  render() {
    return (
      <Stack vertical>
        <InlineStack direction="row" align="center">
          <Placeholder width="106px" label="row" />
          <Placeholder width="106px" height="20px" />
          <Placeholder width="106px" height="20px" />
          <Placeholder width="106px" height="20px" />
          <Placeholder width="106px" height="20px" />
          <Placeholder width="106px" height="20px" />
          <Placeholder width="106px" height="20px" />
        </InlineStack>
        <Divider />
        <InlineStack direction="row-reverse" align="center">
          <Placeholder width="106px" label="row-reverse" />
          <Placeholder width="106px" height="20px" />
          <Placeholder width="106px" height="20px" />
          <Placeholder width="106px" height="20px" />
          <Placeholder width="106px" height="20px" />
          <Placeholder width="106px" height="20px" />
          <Placeholder width="106px" height="20px" />
        </InlineStack>
      </Stack>
    );
  },
};

type PlaceholderProps = {
  width: string;
  height?: string;
  minHeight?: string;
  label?: string;
  slim?: boolean;
};

function Placeholder({ width, height, minHeight, label, slim }: PlaceholderProps) {
  const labelMarkup = label ? (
    <Text as="span" variant="bodySm" fontWeight="bold">
      <span style={{ color: "white" }}>{label}</span>
    </Text>
  ) : undefined;
  return (
    <StyledBox style={{ width, height, minHeight }} slim={slim}>
      {labelMarkup}
    </StyledBox>
  );
}

const StyledBox = styled.div<{
  slim?: boolean;
}>`
  background: ${(p) => p.theme.colors.textHighlight};
  border: ${(p) => p.theme.shape.borderDivider};
  padding: ${(p) => p.theme.spacing(p.slim ? 0 : 2, 4)};
`;
