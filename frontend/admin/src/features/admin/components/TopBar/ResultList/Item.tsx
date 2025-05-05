import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Icon, type IconSource, Spinner, Stack, Text, type Theme, UnstyledLink } from "@/ui-components";

interface Props {
  icon?: IconSource;
  title: React.ReactNode;
  children?: React.ReactNode;
  url?: string;
  selected?: boolean;
  hasMore?: boolean;
  loading?: boolean;
  onClick?(): void;
}

export function Item({ icon, title, url, selected = false, hasMore, loading, children, onClick }: Props) {
  let titleMarkup: React.ReactNode;
  if (typeof title === "string") {
    if (hasMore) {
      titleMarkup = <StyledButton isLoading={loading}>{loading ? <Spinner size="small" /> : title}</StyledButton>;
    } else {
      titleMarkup = <Text as="h4">{title}</Text>;
    }
  } else {
    titleMarkup = title;
  }

  const contentMarkup = children ? (
    <Stack vertical spacing="extraTight">
      {titleMarkup}
      {children}
    </Stack>
  ) : (
    titleMarkup
  );

  const itemMarkup = icon ? (
    <Stack spacing="tight" alignment="center">
      <Icon source={icon} color="base" />
      {contentMarkup}
    </Stack>
  ) : (
    contentMarkup
  );

  return url ? (
    <StyledItemLink url={url} selected={selected} onClick={onClick}>
      {itemMarkup}
    </StyledItemLink>
  ) : (
    <StyledItem onClick={onClick} selected={selected}>
      {itemMarkup}
    </StyledItem>
  );
}

const itemStyle = (theme: Theme, selected: boolean) => {
  return css`
    display: flex;
    text-decoration: none;
    color: ${theme.colors.text};
    cursor: pointer;
    border-radius: ${theme.shape.borderRadius("base")};
    padding: ${theme.spacing(1)};
    &:hover {
      background-color: ${theme.colors.backgroundHoverred};
    }
    &:active {
      background-color: ${theme.colors.backgroundPressed};
    }
    ${selected &&
    css`
      background-color: ${theme.colors.backgroundPressed};
    `}
    min-height: 36px;
  `;
};

const StyledItemLink = styled(UnstyledLink)<{
  selected: boolean;
}>`
  ${(p) => itemStyle(p.theme, p.selected)}
`;

const StyledItem = styled.div<{
  selected: boolean;
}>`
  ${(p) => itemStyle(p.theme, p.selected)}
`;

const StyledButton = styled.span<{
  isLoading?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  color: ${(p) => (p.isLoading ? p.theme.colors.text : p.theme.colors.interactive)};
`;
