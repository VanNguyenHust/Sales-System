import styled from "@emotion/styled";
import { Link, Stack, Text } from "@/ui-components";
import { differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";

import IconNews from "app/assets/icon/admin-notification/icon-news.svg";
import IconPromotion from "app/assets/icon/admin-notification/icon-promotion.svg";
import IconSystem from "app/assets/icon/admin-notification/icon-system.svg";
import { useBulkUpdateAdminNotificationMutation } from "app/features/admin-notification/api";
import { AdminNotification } from "app/types";
import { DATE_TIME_FORMAT, useDatetime } from "app/utils/datetime";
import { useTenant } from "app/utils/useTenant";

type Props = { item: AdminNotification; onClick: () => void };

export const Item = ({ item, onClick }: Props) => {
  const [bulkUpdate] = useBulkUpdateAdminNotificationMutation();
  const { formatDate } = useDatetime();
  const { getAdminRelativePath } = useTenant();
  let external = false;
  let link: string;
  if (item.link) {
    const adminRelativePath = getAdminRelativePath(item.link.url);
    if (adminRelativePath) {
      link = adminRelativePath;
    } else {
      link = item.link.url;
      external = true;
    }
  } else {
    link = `/admin/adminnotifications/${item.id}`;
  }

  const formattedDateTime = formatDate(item.created_on, DATE_TIME_FORMAT);
  const relativeTime = formatRelativeTime(item.created_on);

  const markRead = async (id: number) => {
    await bulkUpdate({ operation: "mark_read", target_selection: "ids", ids: [id] }).unwrap();
  };

  return (
    <StyledItem isRead={item.is_read}>
      <Link
        url={link}
        external={external}
        removeUnderline
        onClick={() => {
          onClick();
          !item.is_read && markRead(item.id);
        }}
      >
        <StyledIcon>
          <img src={item.category === "news" ? IconNews : item.category === "promotion" ? IconPromotion : IconSystem} />
        </StyledIcon>
        <Stack vertical spacing="none">
          <Text as="p" fontWeight="medium">
            {item.title}
          </Text>
          <Text as="p" variant="bodySm" color="subdued">
            {relativeTime ? <span title={formattedDateTime}>{relativeTime}</span> : formattedDateTime}
          </Text>
        </Stack>
      </Link>
    </StyledItem>
  );
};

function formatRelativeTime(ts: string) {
  const date = new Date(ts);
  const now = new Date();
  const totalSeconds = differenceInSeconds(now, date);
  const totalMinutes = differenceInMinutes(now, date);
  const totalHours = differenceInHours(now, date);

  if (totalSeconds < 60) {
    return `${totalSeconds} giây trước`;
  } else if (totalMinutes >= 1 && totalMinutes < 60) {
    return `${totalMinutes} phút trước`;
  } else if (totalHours >= 1 && totalHours < 24) {
    const minute = totalMinutes - totalHours * 60;
    if (totalMinutes === 0) {
      return `${totalHours} giờ trước`;
    } else {
      return `${totalHours} giờ ${minute} phút trước`;
    }
  }
}

const StyledItem = styled.div<{ isRead: boolean }>`
  border-bottom: ${(p) => p.theme.shape.borderDivider};
  a {
    display: flex;
    align-items: flex-start;
    padding: ${(p) => p.theme.spacing(3, 4)};
    gap: ${(p) => p.theme.spacing(2)};
    ${(p) => !p.isRead && `background: ${p.theme.colors.surfaceSelected};`}
    color: ${(p) => p.theme.colors.text};
    &:hover {
      text-decoration: none;
    }
  }
`;

const StyledIcon = styled.div`
  display: flex;
  align-items: center;
  width: ${(p) => `calc(${p.theme.spacing(8)} - ${p.theme.spacing(0.5)})`};
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing(1)};
`;
