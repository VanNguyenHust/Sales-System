import { useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {
  Card,
  Icon,
  Scrollable,
  ScrollLock,
  Spinner,
  Stack,
  Tabs,
  Tag,
  Text,
  TopBar as UITopBar,
  useBreakpoints,
  useEventListener,
} from "@/ui-components";
import { BoxIcon, ReceiptListIcon, SearchIcon, UserIcon } from "@/ui-icons";

import { usePermission } from "app/features/auth/usePermission";
import { GlobalSearchType } from "app/types";

import { FilterType, tabs } from "./constants";
import { ResultList } from "./ResultList";
import { SecondaryMenu } from "./SecondaryMenu";
import { UserMenu } from "./UserMenu";
import { useSearch } from "./useSearch";
import { getUrlForItem } from "./utils";

interface Props {
  toggleNavigationMobile(): void;
}

export const iconMap: { [key in FilterType]: React.ReactNode } = {
  all: <SearchIcon />,
  product: <BoxIcon />,
  customer: <UserIcon />,
  order: <ReceiptListIcon />,
};

export function TopBar({ toggleNavigationMobile }: Props) {
  const { mdUp } = useBreakpoints();
  const navigate = useNavigate();
  const { hasSomePermissions } = usePermission();

  const {
    active,
    focused,
    selectedItem,
    filter,
    changeFilter,
    isSearch,
    limit,
    text,
    changeText,
    items,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    reset,
    clearFilter,
    activate,
    deactivate,
    selectNext,
    selectPrevious,
    selectedIndex,
  } = useSearch();

  const selectItem = () => {
    if (typeof selectedItem === "object") {
      deactivate();
      const url = getUrlForItem(selectedItem.id, selectedItem.type);
      navigate(url);
    } else if (selectedItem) {
      loadMore();
    }
  };

  const searchResultRef = useRef<HTMLDivElement>(null);
  const scrollTo = (id: number) => {
    if (searchResultRef?.current) {
      searchResultRef.current.children.item(id)!.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !text && selectedTab.id === "all") {
      e.preventDefault();
      reset();
    } else if (e.key === "Escape") {
      e.preventDefault();
      deactivate();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!searchResultRef?.current || searchResultRef?.current.children.length > selectedIndex * 2 + 1) {
        selectNext();
        scrollTo(selectedIndex * 2 + 2);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (selectedIndex > 0) {
        selectPrevious();
        scrollTo(selectedIndex * 2 - 2);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      selectItem();
    }
  };

  useEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "k") {
      if (!active && !document.body.hasAttribute("data-lock-scrolling")) {
        e.preventDefault();
        activate();
      }
    }
  });

  let itemsMarkup: JSX.Element | undefined = undefined;
  if (items.length) {
    itemsMarkup = (
      <ResultList
        items={items}
        selected={typeof selectedItem === "object" ? selectedItem.id : selectedItem === "loadMore" ? -1 : undefined}
        loading={isLoadingMore}
        hasMore={hasMore}
        moreCount={limit}
        onLoadMore={loadMore}
        onItemClick={deactivate}
      />
    );
  } else if (!isLoading && isSearch) {
    itemsMarkup = (
      <StyledEmptyState>
        <Stack vertical spacing="tight">
          <p>Không tìm thấy kết quả. Thử thay đổi từ khóa và tìm lại</p>
        </Stack>
      </StyledEmptyState>
    );
  } else {
    let text: string;
    const icon = iconMap[filter];
    const allText = [
      hasSomePermissions(["read_products"]) ? "sản phẩm" : null,
      hasSomePermissions(["read_orders", "read_assigned_orders"]) ? "đơn hàng" : null,
      hasSomePermissions(["customers"]) ? "khách hàng" : null,
      "...",
    ]
      .filter(Boolean)
      .join(", ");
    switch (filter) {
      case "product":
        text = "Nhập từ khóa để tìm kiếm sản phẩm";
        break;
      case "order":
        text = "Nhập từ khóa để tìm kiếm đơn hàng";
        break;
      case "customer":
        text = "Nhập từ khóa để tìm kiếm khách hàng";
        break;
      default:
        text = `Nhập từ khóa để tìm kiếm ${allText}`;
        break;
    }
    itemsMarkup = (
      <StyledEmptyState>
        <Stack vertical spacing="tight">
          <StyledIconCustom>{icon}</StyledIconCustom>
          <Text as="span" color="subdued">
            {text}
          </Text>
        </Stack>
      </StyledEmptyState>
    );
  }

  const availableTabs = useMemo(
    () =>
      tabs.filter((tab) => {
        if (tab.id === GlobalSearchType.Product && !hasSomePermissions(["read_products"])) {
          return false;
        }
        if (tab.id === GlobalSearchType.Order && !hasSomePermissions(["read_orders", "read_assigned_orders"])) {
          return false;
        }
        if (tab.id === GlobalSearchType.Customer && !hasSomePermissions(["customers"])) {
          return false;
        }
        return true;
      }),
    [hasSomePermissions]
  );
  const selectedTab = availableTabs.find((t) => (filter ? t.id === filter : t.id === "all"))!;
  const resultMarkup = (
    <StyledSearchResult onKeyDown={handleSearchKeyDown} tabIndex={-1}>
      {active ? <ScrollLock /> : null}
      <Card>
        <Tabs
          tabs={availableTabs}
          selected={availableTabs.indexOf(selectedTab)}
          onSelect={(idx) => changeFilter(availableTabs[idx].id)}
        />
        <StyledScroll>
          <div ref={searchResultRef}>{itemsMarkup}</div>
        </StyledScroll>
      </Card>
    </StyledSearchResult>
  );

  const searchTagMarkup =
    selectedTab.id !== "all" && mdUp ? (
      <Tag onRemove={clearFilter}>
        <Stack spacing="extraTight" alignment="center">
          <StyledIconCustom tag>{iconMap[selectedTab.id]}</StyledIconCustom>
          <Text as="span" fontWeight="medium">
            {selectedTab.content}
          </Text>
        </Stack>
      </Tag>
    ) : null;

  const searchPrefix = (
    <Stack alignment="center" spacing="extraTight">
      {isLoading ? (
        <StyledSpinner>
          <Spinner size="small" />
        </StyledSpinner>
      ) : (
        <Icon source={SearchIcon} color="base" />
      )}
      {searchTagMarkup}
    </Stack>
  );

  const searchFieldMarkup = (
    <StyledSearchField onKeyDown={handleSearchKeyDown} active={active}>
      <UITopBar.SearchField
        placeholder={mdUp ? "Tìm kiếm (Ctrl + K)" : "Tìm kiếm"}
        value={text}
        prefix={searchPrefix}
        focused={focused}
        onFocus={() => !focused && activate()}
        onChange={changeText}
        onCancel={reset}
      />
    </StyledSearchField>
  );

  return (
    <UITopBar
      showNavigationToggle
      onNavigationToggle={toggleNavigationMobile}
      userMenu={<UserMenu />}
      secondaryMenu={<SecondaryMenu />}
      searchResultsVisible={active}
      searchField={searchFieldMarkup}
      searchResults={resultMarkup}
      onSearchResultsDismiss={deactivate}
    />
  );
}

const StyledSearchField = styled.span<{
  active: boolean;
}>`
  div[data-segment-control] {
    border-color: transparent;
  }
  ${(p) =>
    !p.active
      ? css`
          cursor: pointer;
          input {
            cursor: pointer;
          }
          &:hover {
            div[data-segment-control] {
              background: ${p.theme.colors.surfaceHovered};
              border-color: ${p.theme.colors.surfaceHovered};
            }
          }
        `
      : css`
          div[data-segment-control] {
            background: transparent;
            border-color: ${p.theme.colors.textPrimary};
          }
        `}
`;

const StyledSpinner = styled.span`
  display: flex;
  > span {
    display: inline-flex;
  }
`;

export const StyledSearchResult = styled.div`
  outline: none;
`;

const StyledEmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(p) => p.theme.colors.text};
  padding: ${(p) => p.theme.spacing(5, 0)};
`;

const StyledScroll = styled(Scrollable)`
  max-height: calc(100vh - ${(p) => p.theme.components.topBar.height} - (${(p) => p.theme.spacing(10)} * 2));
  padding: ${(p) => p.theme.spacing(5)};
`;

const StyledIconCustom = styled.div<{ tag?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    ${(p) =>
      !p.tag
        ? css`
            width: calc(${p.theme.spacing(10)} - ${p.theme.spacing(1)});
            height: calc(${p.theme.spacing(10)} - ${p.theme.spacing(1)});
            fill: ${p.theme.colors.icon};
            color: ${p.theme.colors.icon};
          `
        : css`
            width: ${p.theme.spacing(4)};
            height: ${p.theme.spacing(4)};
            fill: ${p.theme.colors.textPrimary};
            color: ${p.theme.colors.textPrimary};
          `}
  }
`;
