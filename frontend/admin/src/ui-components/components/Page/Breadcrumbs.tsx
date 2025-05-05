import React from "react";
import { ArrowShortLeftIcon } from "@/ui-icons";

import { Button } from "../Button";

import { CallbackAction, LinkAction } from "./types";

export interface BreadcrumbsProps {
  /** Link hoặc hành động khi click */
  backAction?: CallbackAction | LinkAction;
}

export function Breadcrumbs({ backAction }: BreadcrumbsProps) {
  if (!backAction) {
    return null;
  }
  return (
    <Button
      icon={ArrowShortLeftIcon}
      id={backAction.id}
      url={isLinkAction(backAction) ? backAction.url : undefined}
      onClick={!isLinkAction(backAction) ? backAction.onAction : undefined}
    />
  );
}

function isLinkAction(action: CallbackAction | LinkAction): action is LinkAction {
  return "url" in action;
}
