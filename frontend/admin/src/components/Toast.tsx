// src/components/Toast.tsx
import { App } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { ReactNode } from "react";
import { NotificationPlacement } from "antd/es/notification/interface";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  type?: ToastType;
  message: string;
  description?: string;
  duration?: number;
  placement?: NotificationPlacement;
  icon?: ReactNode;
}

const defaultIcons: Record<ToastType, ReactNode> = {
  success: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
  error: <CloseCircleOutlined style={{ color: "#f5222d" }} />,
  info: <InfoCircleOutlined style={{ color: "#1890ff" }} />,
  warning: <ExclamationCircleOutlined style={{ color: "#faad14" }} />,
};

export const useToast = () => {
  const { notification } = App.useApp();

  const showToast = (options: ToastOptions) => {
    const type = options.type || "info";
    notification[type]({
      message: options.message,
      description: options.description,
      placement: options.placement || "topRight",
      duration: options.duration || 3,
      icon: options.icon ?? defaultIcons[type],
    });
  };

  return { showToast };
};
