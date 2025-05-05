import type { Meta, StoryObj } from "@storybook/react";

import { InlineError } from "./InlineError";

const meta: Meta<typeof InlineError> = {
  title: "InlineError",
  component: InlineError,
};

export default meta;

type Story = StoryObj<typeof InlineError>;

export const Basic: Story = {
  args: {
    message: "Store name is required",
    fieldID: "storeName",
  },
};
