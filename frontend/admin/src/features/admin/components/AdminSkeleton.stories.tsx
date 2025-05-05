import { MemoryRouter } from "react-router-dom";
import { Card, Layout, SkeletonBodyText, SkeletonDisplayText, SkeletonPage, TextContainer } from "@/ui-components";
import type { Meta, StoryObj } from "@storybook/react";

import { AdminSkeleton } from "./AdminSkeleton";

const meta: Meta<typeof AdminSkeleton> = {
  title: "AdminSkeleton",
  component: AdminSkeleton,
};

export default meta;

type Story = StoryObj<typeof AdminSkeleton>;

export const Basic: Story = {
  render() {
    return (
      <AdminSkeleton>
        <SkeletonPage>
          <Layout>
            <Layout.Section>
              <Card sectioned>
                <SkeletonBodyText />
              </Card>
              <Card sectioned>
                <TextContainer>
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText />
                </TextContainer>
              </Card>
              <Card sectioned>
                <TextContainer>
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText />
                </TextContainer>
              </Card>
            </Layout.Section>
            <Layout.Section secondary>
              <Card>
                <Card.Section>
                  <TextContainer>
                    <SkeletonDisplayText size="small" />
                    <SkeletonBodyText lines={2} />
                  </TextContainer>
                </Card.Section>
                <Card.Section>
                  <SkeletonBodyText lines={1} />
                </Card.Section>
              </Card>
              <Card subdued>
                <Card.Section>
                  <TextContainer>
                    <SkeletonDisplayText size="small" />
                    <SkeletonBodyText lines={2} />
                  </TextContainer>
                </Card.Section>
                <Card.Section>
                  <SkeletonBodyText lines={2} />
                </Card.Section>
              </Card>
            </Layout.Section>
          </Layout>
        </SkeletonPage>
      </AdminSkeleton>
    );
  },
};
