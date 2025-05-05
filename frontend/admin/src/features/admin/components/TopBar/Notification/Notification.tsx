import { useState } from "react";
import styled from "@emotion/styled";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  InlineStack,
  Popover,
  ScrollLock,
  SkeletonBodyText,
  SkeletonTabs,
  Tabs,
  Text,
} from "@/ui-components";
import { NotificationBeltIcon } from "@/ui-icons";

import EmptyStateImage from "app/assets/images/notification-empty.svg";
import {
  useBulkUpdateAdminNotificationMutation,
  useCountAdminNotificationsQuery,
  useGetAdminNotificationsQuery,
} from "app/features/admin-notification/api";
import { AdminNotification, AdminNotificationCategory } from "app/types";
import { showErrorToast, showToast } from "app/utils/toast";
import { useToggle } from "app/utils/useToggle";

import { MenuItem } from "../MenuItem";

import { Item } from "./Item";

export const Notification = () => {
  const { value: isOpenNotification, toggle: toggleNotification, setFalse: closeNotification } = useToggle(false);
  const { data: totalUnReadCount = 0, isLoading: isLoadingTotalUnReadCount } = useCountAdminNotificationsQuery(
    {
      is_read: false,
    },
    {
      pollingInterval: 60000,
    }
  );
  return (
    <Popover
      active={isOpenNotification}
      onClose={closeNotification}
      preferredAlignment="center"
      preferredPosition="below"
      fullHeight
      activator={
        <MenuItem
          icon={NotificationBeltIcon}
          onClick={toggleNotification}
          badge={totalUnReadCount ? (totalUnReadCount > 99 ? "99+" : `${totalUnReadCount}`) : undefined}
        />
      }
    >
      <ScrollLock />
      <NotificationDetail
        totalUnReadCount={totalUnReadCount}
        isLoading={isLoadingTotalUnReadCount}
        onClose={closeNotification}
      />
    </Popover>
  );
};

type Props = {
  totalUnReadCount: number;
  isLoading: boolean;
  onClose(): void;
};

const NotificationDetail = ({ totalUnReadCount, isLoading: isLoadingTotalUnRead, onClose }: Props) => {
  const [category, setCategory] = useState<AdminNotificationCategory>("system");
  const [bulkUpdate, { isLoading: isBulkUpdating }] = useBulkUpdateAdminNotificationMutation();

  const { data: unReadNotificationSystemCount = 0, isLoading: isLoadingUnReadNotificationSystemCount } =
    useCountAdminNotificationsQuery(
      {
        category: "system",
        is_read: false,
      },
      {
        refetchOnMountOrArgChange: true,
      }
    );

  const { data: unReadNotificationNewsCount = 0, isLoading: isLoadingUnReadNotificationNewsCount } =
    useCountAdminNotificationsQuery(
      {
        category: "news",
        is_read: false,
      },
      {
        refetchOnMountOrArgChange: true,
      }
    );

  const { data: unReadNotificationPromotionCount = 0, isLoading: isLoadingUnReadNotificationPromotionCount } =
    useCountAdminNotificationsQuery(
      {
        category: "promotion",
        is_read: false,
      },
      {
        refetchOnMountOrArgChange: true,
      }
    );

  const { data: top3SystemItems, isLoading: isLoadingTop3SystemItems } = useGetAdminNotificationsQuery(
    {
      limit: 3,
      category: "system",
      sort_key: "id",
      reverse: true,
    },
    {
      skip: category !== "system",
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: top3NewsItems, isLoading: isLoadingTop3NewsItems } = useGetAdminNotificationsQuery(
    {
      limit: 3,
      category: "news",
      sort_key: "id",
      reverse: true,
    },
    {
      skip: category !== "news",
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: top3PromotionItems, isLoading: isLoadingTop3PromotionItems } = useGetAdminNotificationsQuery(
    {
      limit: 3,
      category: "promotion",
      sort_key: "id",
      reverse: true,
    },
    {
      skip: category !== "promotion",
      refetchOnMountOrArgChange: true,
    }
  );

  const handleMarkReadAll = async () => {
    try {
      await bulkUpdate({
        operation: "mark_read",
        target_selection: "all",
      }).unwrap();
      showToast("Đánh dấu đã đọc thành công");
    } catch (e) {
      showErrorToast("Đánh dấu đã đọc thất bại");
    }
  };

  let isLoadingItems = true;
  let isEmptyState = true;
  let items: AdminNotification[] = [];
  if (category === "system") {
    isLoadingItems = isLoadingTop3SystemItems;
    isEmptyState = top3SystemItems?.length === 0;
    items = top3SystemItems ?? [];
  } else if (category === "news") {
    isLoadingItems = isLoadingTop3NewsItems;
    isEmptyState = top3NewsItems?.length === 0;
    items = top3NewsItems ?? [];
  } else if (category === "promotion") {
    isLoadingItems = isLoadingTop3PromotionItems;
    isEmptyState = top3PromotionItems?.length === 0;
    items = top3PromotionItems ?? [];
  }

  let bodyMarkup: JSX.Element;
  if (isLoadingItems || isLoadingTotalUnRead) {
    bodyMarkup = (
      <Card.Section>
        <SkeletonBodyText lines={8} />
      </Card.Section>
    );
  } else if (isEmptyState) {
    bodyMarkup = (
      <Card.Section>
        <EmptyState image={EmptyStateImage}>Cửa hàng của bạn chưa có thông báo nào</EmptyState>
      </Card.Section>
    );
  } else {
    const itemsMarkup = items.map((item) => <Item item={item} key={item.id} onClick={onClose} />);
    bodyMarkup = (
      <>
        {itemsMarkup}
        <Card.Section>
          <Button plain url={`/admin/adminnotifications?category=${category}`} onClick={onClose} fullWidth>
            Xem tất cả thông báo
          </Button>
        </Card.Section>
      </>
    );
  }
  return (
    <StyledWidth>
      <Card
        title={
          <Text as="span" variant="headingLg" fontWeight="medium">
            Thông báo {totalUnReadCount ? `(${totalUnReadCount})` : ""}
          </Text>
        }
        actions={
          totalUnReadCount
            ? [
                {
                  content: "Đánh dấu tất cả là đã đọc",
                  disabled: isBulkUpdating,
                  onAction: handleMarkReadAll,
                },
              ]
            : undefined
        }
        divider
      >
        {isLoadingUnReadNotificationNewsCount ||
        isLoadingUnReadNotificationSystemCount ||
        isLoadingUnReadNotificationSystemCount ? (
          <SkeletonTabs count={3} fitted />
        ) : (
          <Tabs
            tabs={tabs.map((tab) => {
              const count =
                tab.id === "system"
                  ? unReadNotificationSystemCount
                  : tab.id === "news"
                  ? unReadNotificationNewsCount
                  : unReadNotificationPromotionCount;
              return {
                ...tab,
                content: (
                  <InlineStack gap="1">
                    {tab.content}
                    {count ? (
                      <StyledBadge>
                        <Badge status="new" size="small">
                          {count > 99 ? `99+` : count.toString()}
                        </Badge>
                      </StyledBadge>
                    ) : undefined}
                  </InlineStack>
                ),
              };
            })}
            selected={tabs.findIndex((tab) => tab.id === category)}
            fitted
            onSelect={(index) => setCategory(tabs[index].id as AdminNotificationCategory)}
          />
        )}
        {bodyMarkup}
      </Card>
    </StyledWidth>
  );
};

const tabs: {
  id: AdminNotificationCategory;
  content: string;
}[] = [
  {
    id: "system",
    content: "Hệ thống",
  },
  {
    id: "news",
    content: "Tin tức",
  },
  {
    id: "promotion",
    content: "Khuyến mại",
  },
];

const StyledWidth = styled.div`
  width: calc((${(p) => p.theme.spacing(10)} * 10) + ${(p) => p.theme.spacing(5)});
  max-width: 100%;
  & > div {
    box-shadow: none;
    outline: 0;
  }
  ul {
    li {
      button {
        padding-left: 0;
        padding-right: 0;
        display: flex;
        justify-content: center;
      }
    }
  }
`;

const StyledBadge = styled.span`
  & > span {
    padding: ${(p) => p.theme.spacing(0.25, 1)};
    min-width: calc(${(p) => `${p.theme.spacing(4)} + ${p.theme.spacing(0.5)}`});
    justify-content: center;
  }
`;
