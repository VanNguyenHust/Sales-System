export interface NotificationTemplate {
  template: string;
  name: string;
  description?: string;
  subject: string;
  content: string;
  active: boolean;
  can_edit_active: boolean;
  same_as_default: boolean;
  category?: string;
  created_on?: string;
  modified_on?: string;
}

export interface NotificationTemplateRequest {
  subject?: string;
  content?: string;
  active?: boolean;
  same_as_default?: boolean;
}
export interface NotificationTemplatePreview {
  subject: string;
  content: string;
}

export interface NotificationEmailTestRequest {
  template: string;
  to: string;
  receiver?: string;
}
export interface NotificationTemplatePreviewRequest {
  template: string;
  subject?: string;
  content?: string;
  template_setting?: NotificationTemplateSettingRequest;
}

export interface NotificationTemplateSettingRequest {
  accent_color?: string;
  logo_width?: string;
  logo_key?: string;
}

export interface NotificationTemplateResponse {
  template: string;
  name: string;
  description: string;
  subject: string;
  content: string;
  active: boolean;
  can_edit_active: boolean;
  same_as_default: boolean;
  category: string;
  created_on: string;
  modified_on: string;
}

export interface NotificationTemplatesResponse {
  notification_templates: NotificationTemplate[];
}
export interface NotificationTemplatePreviewResponse {
  notification_template_preview: NotificationTemplatePreview;
}

export interface PrintFormItem {
  document_type: string;
  group: string;
}

export interface NotificationTemplateSettingResponse {
  accent_color: string;
  logo_width: string;
  logo_key: string;
}

export interface OrderEmailSubscriptionsResponse {
  id: number;
  email: string;
  active: boolean;
  created_on: Date;
  modified_on: Date;
}

export interface OrderMobileSubscriptionsResponse {
  id: number;
  device_id: string;
  device_token: string;
  device: string;
  type: string;
  version: string;
  active: boolean;
  created_on: Date;
  modified_on: Date;
}

export interface OrderMobileSubscriptionsRequest {
  device_id: string;
  device_token: string;
  device: string;
  type: "ios" | "android" | "web";
  version: string;
  active: boolean;
}

export interface NotificationSettingResponse {
  template_setting: NotificationTemplateSettingResponse;
  order_email_subscriptions: OrderEmailSubscriptionsResponse[];
  order_mobile_subscriptions: OrderMobileSubscriptionsResponse[];
  comment_email_enabled: boolean;
}

export interface NotificationSettingRequest {
  template_setting?: NotificationTemplateSettingRequest;
  order_email_subscriptions_add?: { email: string; active: boolean };
  order_email_subscriptions_update?: { id: number; active: boolean };
  order_email_subscriptions_remove?: { id: number };
  order_mobile_subscriptions_add?: OrderMobileSubscriptionsRequest;
  order_mobile_subscriptions_update?: { id: number; active: boolean };
  order_mobile_subscriptions_remove?: { id: number };
  comment_email_enabled?: boolean;
}
export interface NotificationTemplate {
  template: string;
  name: string;
  description?: string;
  subject: string;
  content: string;
  active: boolean;
  can_edit_active: boolean;
  same_as_default: boolean;
  category?: string;
  created_on?: string;
  modified_on?: string;
}

export interface NotificationTemplateRequest {
  subject?: string;
  content?: string;
  active?: boolean;
  same_as_default?: boolean;
}

export interface NotificationTemplatePreview {
  subject: string;
  content: string;
}
export interface NotificationTemplatePreviewRequest {
  template: string;
  subject?: string;
  content?: string;
  template_setting?: NotificationTemplateSettingRequest;
}

export interface NotificationTemplateSettingRequest {
  accent_color?: string;
  logo_width?: string;
  logo_key?: string;
}

export interface NotificationTemplateResponse {
  notification_template: NotificationTemplate;
}
export interface NotificationTemplatesResponse {
  notification_templates: NotificationTemplate[];
}
export interface NotificationTemplatePreviewResponse {
  notification_template_preview: NotificationTemplatePreview;
}

export interface PrintFormGroup {
  title: string;
  template_names: string[];
}
