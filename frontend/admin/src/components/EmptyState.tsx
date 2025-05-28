import { Empty } from "antd";
import { ReactNode } from "react";

interface EmptyStateProps {
  description?: string;
  action?: ReactNode;
  image?: string;
}

const EmptyState = ({ description, action, image }: EmptyStateProps) => {
  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <Empty
        image={image || Empty.PRESENTED_IMAGE_SIMPLE}
        description={description || "Không có dữ liệu"}
      />
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
};

export default EmptyState;
