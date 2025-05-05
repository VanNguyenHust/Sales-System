import { ComponentProps } from "react";
import { type IconSource, Navigation } from "@/ui-components";

export interface NavBarAppDetail {
  aliasOrKey: string;
  apiKey: string;
  label: string;
  icon?: IconSource;
  external?: boolean;
}

type SectionProps = ComponentProps<typeof Navigation.Section>;

export type NavigationItemProps = SectionProps["items"][number];
export type NavigationSubItemProps = NonNullable<NavigationItemProps["subNavigationItems"]>[number];
