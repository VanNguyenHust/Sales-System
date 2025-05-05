import React from "react";
import {
  CloseBigIcon,
  CopyIcon,
  ExportIcon,
  ImportIcon,
  PenLineIcon,
  PlusCircleOutlineIcon,
  PlusSquareIcon,
  PrintIcon,
  VisibilityBlackIcon,
} from "@/ui-icons";
import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "../Badge";
import { Button } from "../Button";
import { ButtonGroup } from "../ButtonGroup";
import { Card } from "../Card";
import { Icon } from "../Icon";
import { Stack } from "../Stack";

import { Page } from "./Page";

const meta: Meta<typeof Page> = {
  title: "Page",
  component: Page,
};

export default meta;

type Story = StoryObj<typeof Page>;

export const Default: Story = {
  render: () => {
    return (
      <Page
        backAction={{ id: "#" }}
        title="Danh sách sản phẩm"
        primaryAction={{ content: "Thêm sản phẩm", icon: PlusCircleOutlineIcon }}
        secondaryActions={[
          {
            content: "Xuất file",
            icon: ExportIcon,
          },
          {
            content: "Nhập file",
            icon: ImportIcon,
          },
        ]}
        actionGroups={[
          {
            title: "Chia sẻ",
            actions: [
              {
                content: "Share on Facebook",
              },
              {
                content: "Share on Twitter",
              },
            ],
          },
        ]}
      >
        <Card title="Sản phẩm" sectioned>
          <p>Thông tin sản phẩm</p>
        </Card>
      </Page>
    );
  },
};

export const WithDivider = () => (
  <Page title="General" divider>
    <Card title="Credit card" sectioned>
      <p>Credit card information</p>
    </Card>
  </Page>
);

export const WithCustomPrimaryAction = () => (
  <Page
    backAction={{ url: "#" }}
    title="General"
    primaryAction={
      <ButtonGroup segmented>
        <Button outline>one</Button>
        <Button outline>two</Button>
      </ButtonGroup>
    }
  >
    <Card title="Credit card" sectioned>
      <p>Credit card information</p>
    </Card>
  </Page>
);

export const WithoutPrimaryActionInHeader = () => (
  <Page
    backAction={{ url: "#" }}
    title="Tinh chất Estee Lauder Advanced Night Repair"
    secondaryActions={[
      { content: "Xem trên web", icon: VisibilityBlackIcon },
      { content: "Sao chép", icon: CopyIcon },
    ]}
    pagination={{
      hasPrevious: true,
      hasNext: true,
    }}
  >
    <Card sectioned title="Fulfill order">
      <Stack alignment="center">
        <Stack.Item fill>
          <p>Buy postage and ship remaining 2 items</p>
        </Stack.Item>
        <Button primary>Continue</Button>
      </Stack>
    </Card>
  </Page>
);

export const WithDestructiveSecondaryAction = () => (
  <Page title="General" secondaryActions={[{ icon: CloseBigIcon, content: "Delete", destructive: true }]}>
    <p>Page content</p>
  </Page>
);

export const WithCustomSecondaryAction = () => (
  <Page
    title="General"
    secondaryActions={
      <ButtonGroup segmented>
        <Button outline>one</Button>
        <Button outline>two</Button>
      </ButtonGroup>
    }
  >
    <p>Page content</p>
  </Page>
);

export const WithSubtitle = () => (
  <Page
    backAction={{ url: "#" }}
    title="SON22268"
    titleMetadata={<Badge status="warning">Chưa xử lý</Badge>}
    subtitle="14/03/2023 09:28"
    secondaryActions={[
      { icon: PenLineIcon, content: "Sửa đơn" },
      { content: "In đơn hàng", icon: PrintIcon },
    ]}
  >
    <Card title="Credit card" sectioned>
      <p>Credit card information</p>
    </Card>
  </Page>
);

export const WithAdditionalMetadata = () => (
  <Page
    backAction={{ url: "#" }}
    title="SON22268"
    additionalMetadata={
      <>
        14/03/2023 09:28 <Badge status="warning">Chưa xử lý</Badge>
      </>
    }
    secondaryActions={[
      { icon: PenLineIcon, content: "Sửa đơn" },
      { content: "In đơn hàng", icon: PrintIcon },
    ]}
  >
    <Card title="Credit card" sectioned>
      <p>Credit card information</p>
    </Card>
  </Page>
);

export const WithoutPagination = () => (
  <Page backAction={{ url: "#" }} title="General" primaryAction={{ content: "Save" }}>
    <Card title="Credit card" sectioned>
      <p>Credit card information</p>
    </Card>
  </Page>
);

export const WithFullWidth = () => (
  <Page
    fullWidth
    title="Orders"
    primaryAction={{ content: "Create order", icon: PlusCircleOutlineIcon }}
    secondaryActions={[{ content: "Export" }]}
    pagination={{
      hasNext: true,
    }}
  >
    <Card title="Credit card" sectioned>
      <p>Credit card information</p>
    </Card>
  </Page>
);

export const WithNarrowWidth = () => (
  <Page
    narrowWidth
    backAction={{ url: "#" }}
    title="Add payment method"
    primaryAction={{ content: "Save", disabled: true }}
  >
    <Card title="Credit card" sectioned>
      <p>Credit card information</p>
    </Card>
  </Page>
);

export const WithActionGroups = () => (
  <Page
    title="Chi tiết sản phẩm"
    secondaryActions={[
      {
        content: "Xem trên web",
        icon: VisibilityBlackIcon,
      },
      {
        content: "Sao chép",
        icon: CopyIcon,
      },
    ]}
    actionGroups={[
      {
        title: "Thao tác khác",
        actions: [
          {
            content: "Share on Facebook",
          },
          {
            content: "Share on Twitter",
          },
        ],
      },
    ]}
    pagination={{
      hasNext: true,
      hasPrevious: true,
    }}
  >
    <Card title="Thông tin sản phẩm" sectioned>
      <p>sản phẩm</p>
    </Card>
  </Page>
);

export const WithContentAfterTitle = () => (
  <Page
    backAction={{ url: "#" }}
    title="Jar With Lock-Lid"
    titleMetadata={<Icon source={PlusSquareIcon} />}
    primaryAction={{ content: "Save", disabled: true }}
    secondaryActions={[{ content: "Duplicate" }, { content: "View on your store" }]}
    pagination={{
      hasPrevious: true,
      hasNext: true,
    }}
  >
    <Card title="Credit card" sectioned>
      <p>Credit card information</p>
    </Card>
  </Page>
);
