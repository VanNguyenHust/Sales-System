import {
  type ComplexAction,
  type MenuGroupDescriptor,
  Page as UIPage,
  type PageProps as UIPageProps,
} from "@/ui-components";
import { CopyIcon, ExportIcon, ImportIcon, PlusCircleOutlineIcon, PrintIcon, ShareOutlineIcon } from "@/ui-icons";

import { useMobileBridge } from "app/features/mobile-bridge";
import type { Icon } from "app/features/mobile-bridge/actions/Button";
import type { ActionGroupProps, ActionProps, MobileBridgeApplication } from "app/features/mobile-bridge/types";
import { dispatchRedirect } from "app/features/mobile-bridge/util/dispatchRedirect";
import type { Action, ActionGroup } from "app/types";
import { isSapoMobileBridge } from "app/utils/mobile";

import { TitleBar } from "../features/mobile-bridge/components/TitleBar";

export type PageProps = Without<UIPageProps, "primaryAction" | "actionGroups" | "secondaryActions"> & {
  title: string;
  primaryAction?: Action;
  secondaryActions?: Action[];
  actionGroups?: ActionGroup[];
};

/**
 * Universal Page
 *
 * - in web: using Page ui component
 * - in mobible bridge: using TitleBar action
 */
export function Page(props: PageProps) {
  const app = useMobileBridge();

  const {
    title,
    backAction,
    primaryAction,
    secondaryActions,
    actionGroups,
    children,
    subtitle,
    titleMetadata,
    ...restProps
  } = props;
  if (isSapoMobileBridge) {
    return (
      <UIPage {...restProps}>
        <TitleBar
          title={title}
          primaryAction={primaryAction ? transformBridgeAction(app, primaryAction) : undefined}
          secondaryActions={secondaryActions ? transformBridgeActions(app, secondaryActions) : undefined}
          actionGroups={actionGroups ? transformBridgeActionGroups(app, actionGroups) : undefined}
        />
        {children}
      </UIPage>
    );
  }

  return (
    <UIPage
      title={title}
      subtitle={subtitle}
      titleMetadata={titleMetadata}
      backAction={backAction}
      primaryAction={primaryAction ? transformUIAction(primaryAction) : undefined}
      secondaryActions={secondaryActions ? transformUIActions(secondaryActions) : undefined}
      actionGroups={actionGroups ? transformUIActionGroups(actionGroups) : undefined}
      {...restProps}
    >
      {children}
    </UIPage>
  );
}

const icons = {
  create: PlusCircleOutlineIcon,
  print: PrintIcon,
  share: ShareOutlineIcon,
  import: ImportIcon,
  export: ExportIcon,
  duplicate: CopyIcon,
} satisfies Record<Icon, React.FunctionComponent<React.SVGProps<SVGSVGElement>>>;

function transformUIAction({ icon: iconProp, ...rest }: Action): ComplexAction {
  let icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | undefined = undefined;
  if (typeof iconProp === "string") {
    icon = icons[iconProp];
  } else if (iconProp) {
    icon = iconProp;
  }
  return {
    ...rest,
    icon,
  };
}

function transformUIActions(actions: Action[]): ComplexAction[] {
  return actions.map(transformUIAction);
}

function transformUIActionGroups(actionGroups: ActionGroup[]): MenuGroupDescriptor[] {
  return actionGroups.map((group) => ({
    ...group,
    actions: transformUIActions(group.actions),
  }));
}

function transformBridgeAction(
  app: MobileBridgeApplication,
  { icon: iconProp, url, onAction, ...rest }: Action
): ActionProps {
  return {
    ...rest,
    onAction: () => {
      if (url) {
        dispatchRedirect(app, url);
      }
      onAction?.();
    },
    icon: typeof iconProp === "string" ? iconProp : undefined,
  };
}

function transformBridgeActions(app: MobileBridgeApplication, actions: Action[]): ActionProps[] {
  return actions.map((action) => transformBridgeAction(app, action));
}

function transformBridgeActionGroups(app: MobileBridgeApplication, actionGroups: ActionGroup[]): ActionGroupProps[] {
  return actionGroups.map((group) => ({
    ...group,
    actions: transformBridgeActions(app, group.actions),
  }));
}
