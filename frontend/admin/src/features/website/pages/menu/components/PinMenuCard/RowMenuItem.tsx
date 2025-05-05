import { useEffect } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button, Icon, Text } from "@/ui-components";
import { ArrowChevronBigDownIcon, ArrowChevronBigRightIcon } from "@/ui-icons";

import { Link, Linklist, SubjectLinkParentInfo } from "app/features/website/types";
import { useToggle } from "app/utils/useToggle";

interface Props {
  isParent?: boolean;
  linkList?: Linklist;
  link?: Link;
  level: number;
  onAddMenu: (link: SubjectLinkParentInfo) => void;
  linkRootId?: number;
  isOpen?: boolean;
}

const RowMenuItem = ({ isParent, linkList, link, level, onAddMenu, linkRootId, isOpen }: Props) => {
  const { value, toggle, setTrue } = useToggle(false);

  useEffect(() => {
    if (isOpen) setTrue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <>
      {isParent
        ? linkList && (
            <StyledRowItemContairner>
              <StyledRowItemParent isParent={isParent} isActive={value && linkList.links.length > 0}>
                <StyledRowItemContent>
                  <StyledIcon onClick={toggle}>
                    {linkList.links.length > 0 && (
                      <Icon
                        source={value ? ArrowChevronBigDownIcon : ArrowChevronBigRightIcon}
                        color={value ? "interactive" : "base"}
                      />
                    )}
                  </StyledIcon>
                  <Text as="p" variant="bodyMd">
                    {linkList.title}
                  </Text>
                </StyledRowItemContent>
                <Button
                  plain
                  onClick={() => {
                    onAddMenu({
                      title: linkList.title,
                      linklistRootId: linkList.id,
                    });
                  }}
                >
                  Thêm vào
                </Button>
              </StyledRowItemParent>
              {value && linkList.links.length > 0 && (
                <StyledLinkListRowItem>
                  {linkList.links.map((link) => {
                    return (
                      <RowMenuItem
                        key={link.id}
                        link={link}
                        level={level + 1}
                        onAddMenu={onAddMenu}
                        linkRootId={linkList.id}
                      />
                    );
                  })}
                </StyledLinkListRowItem>
              )}
            </StyledRowItemContairner>
          )
        : link &&
          level <= 3 && (
            <StyledRowItemLink level={level}>
              <StyledRowItem level={level} showBorderLine={value} linkSize={link.links.length}>
                <StyledRowItemContent>
                  <StyledIcon onClick={toggle}>
                    {link.links.length > 0 && level < 3 && (
                      <Icon
                        source={value ? ArrowChevronBigDownIcon : ArrowChevronBigRightIcon}
                        color={value ? "interactive" : "base"}
                      />
                    )}
                  </StyledIcon>
                  <Text as="p" variant="bodyMd">
                    {link.title}
                  </Text>
                </StyledRowItemContent>
                <Button
                  plain
                  onClick={() => {
                    onAddMenu({
                      title: link.title ?? "",
                      linkParentId: link.id,
                      linklistRootId: linkRootId || 0,
                    });
                  }}
                >
                  Thêm vào
                </Button>
              </StyledRowItem>
              {value &&
                link.links.length > 0 &&
                link.links.map((link) => {
                  return (
                    <RowMenuItem
                      key={link.id}
                      link={link}
                      level={level + 1}
                      onAddMenu={onAddMenu}
                      linkRootId={linkRootId}
                    />
                  );
                })}
            </StyledRowItemLink>
          )}
    </>
  );
};

const StyledRowItemContairner = styled.div`
  border: ${(p) => p.theme.shape.borderDivider};
  border-radius: 6px;
  margin: ${(p) => p.theme.spacing(4, 0, 0)};
`;
const StyledLinkListRowItem = styled.div`
  border: ${(p) => p.theme.shape.borderDivider};
  border-radius: 6px;
  margin: ${(p) => p.theme.spacing(4)};
  & > div:not(:first-child) {
    border-top: ${(p) => p.theme.shape.borderDivider};
  }
`;
const StyledRowItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing(1)};
`;
const StyledRowItemParent = styled.div<{ isParent?: boolean; isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing(1)};
  padding: ${(p) => p.theme.spacing(3)};
  ${(p) =>
    !p.isActive
      ? p.isParent &&
        css`
          background: #f3f4f5;
        `
      : css`
          background: #e6f4ff;
        `}
`;
const StyledRowItem = styled.div<{ level?: number; showBorderLine?: boolean; linkSize?: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing(1)};
  padding: ${(p) => p.theme.spacing(3, 3, 3, 3)};
  ${(p) =>
    p.level &&
    p.level < 3 &&
    p.showBorderLine &&
    css`
      border-bottom: ${p.theme.shape.borderDivider};
    `}
`;
const StyledRowItemLink = styled.div<{ level?: number }>`
  ${(p) =>
    p.level &&
    p.level > 1 &&
    css`
      padding: ${p.theme.spacing(0, 0, 0, 3)};
      &:not(:last-child) {
        & ${StyledRowItem} {
          border-bottom: ${p.theme.shape.borderDivider};
        }
      }
    `}
`;
const StyledIcon = styled.div`
  width: fit-content;
  min-width: ${(p) => p.theme.spacing(5)};
  cursor: pointer;
  min-width: 20px;
`;
export default RowMenuItem;
