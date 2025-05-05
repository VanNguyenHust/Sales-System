import { PaginationFilter } from "./common";

export type AdminNotificationCategory = "system" | "news" | "promotion";

export type AdminNotification = {
  id: number;
  title: string;
  body: string;
  is_read: boolean;
  category: AdminNotificationCategory;
  link?: {
    url: string;
  };
  created_on: string;
};

export type AdminNotificationResponse = {
  admin_notification: AdminNotification;
};

export type AdminNotificationsResponse = {
  admin_notifications: AdminNotification[];
};

export type AdminNotificationFilterRequest = PaginationFilter & {
  query?: string;
  category?: AdminNotificationCategory;
  is_read?: boolean;
  created_on_max?: string;
  created_on_min?: string;
  sort_key?: "id";
  reverse?: boolean;
};

export type AdminNotificationBulkUpdateRequest = {
  operation: "mark_read" | "mark_unread";
  target_selection: "ids" | "all";
  ids?: number[];
};
