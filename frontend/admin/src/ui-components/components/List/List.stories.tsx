import React from "react";
import type { StoryFn } from "@storybook/react";

import { MetaWithSubcomponents } from "../../types/storybook";

import { List } from "./List";

const meta: MetaWithSubcomponents<typeof List> = {
  title: "List",
  component: List,
  subcomponents: {
    "List.Item": List.Item,
  },
};

export default meta;

export const Basic: StoryFn<typeof List> = (args) => (
  <List {...args}>
    <List.Item>First item</List.Item>
    <List.Item>Second item</List.Item>
    <List.Item>Third Item</List.Item>
  </List>
);

export const NestedList = () => (
  <List>
    <List.Item>
      <List type="bullet">
        <List.Item>First item</List.Item>
        <List.Item>Second item</List.Item>
        <List.Item>Third Item</List.Item>
      </List>
    </List.Item>
    <List.Item>
      <List type="number">
        <List.Item>Fourth Item</List.Item>
        <List.Item>Fifth Item</List.Item>
        <List.Item>Sixth Item</List.Item>
      </List>
    </List.Item>
    <List.Item>
      <List>
        <List.Item>Seventh Item</List.Item>
        <List.Item>Eighth Item</List.Item>
        <List.Item>Ninth Item</List.Item>
      </List>
    </List.Item>
  </List>
);
