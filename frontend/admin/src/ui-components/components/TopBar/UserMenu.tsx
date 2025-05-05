import React from "react";
import styled from "@emotion/styled";
import { ArrowChevronDownIcon } from "@/ui-icons";

import { Action } from "../../types";
import { Avatar, AvatarProps } from "../Avatar";
import { Icon } from "../Icon";
import { Text } from "../Text";

import { Menu } from "./Menu";

export interface UserMenuProps {
  /** Các hành động trong menu */
  actions: { items: Action[] }[];
  /** Tên của người dùng */
  name: string;
  /** Thông tin dưới tên người dùng */
  detail?: string;
  /** Chữ cái để hiển thị trong avatar */
  initials: AvatarProps["initials"];
  /** URL của ảnh avatar */
  avatar?: AvatarProps["source"];
  /** Menu có đang mở hay không? */
  open: boolean;
  /** Hàm gọi lại mở hoặc đóng menu */
  onToggle(): void;
}

export function UserMenu({ actions, name, detail, initials, avatar, open, onToggle }: UserMenuProps) {
  const activatorContentMarkup = (
    <>
      <Avatar size="small" source={avatar} initials={initials && initials.replace(" ", "")} />
      <StyledName>
        <Text as="p" variant="bodyLg" alignment="start" fontWeight="medium" truncate>
          {name}
        </Text>
        <Text as="p" variant="bodySm" alignment="start" color="subdued" truncate>
          {detail}
        </Text>
      </StyledName>
      <StyledIcon>
        <Icon source={ArrowChevronDownIcon} color="base" />
      </StyledIcon>
    </>
  );
  return (
    <Menu
      activatorContent={activatorContentMarkup}
      open={open}
      onOpen={onToggle}
      onClose={onToggle}
      actions={actions}
    />
  );
}

const StyledName = styled.span`
  display: none;
  max-width: ${(p) => p.theme.components.topBar.usernameMaxWidth};
  ${(p) => p.theme.breakpoints.up("md")} {
    display: inline;
  }
`;

const StyledIcon = styled.span`
  display: none;
  align-items: center;
  justify-content: center;
  ${(p) => p.theme.breakpoints.up("md")} {
    display: flex;
  }
`;
