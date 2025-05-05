import { type ComplexAction, EmptyState, Text } from "@/ui-components";

import EmptyLoupeIcon from "app/assets/icon/empty-loupe.svg";

type Props = {
  /** Hành động */
  action?: ComplexAction;
};

export const EmptySearchResult = ({ action }: Props) => {
  return (
    <EmptyState
      image={EmptyLoupeIcon}
      heading="Không tìm thấy dữ liệu phù hợp với kết quả tìm kiếm"
      secondaryAction={action}
    >
      <Text as="p" color="subdued">
        Thử thay đổi điều kiện lọc hoặc từ khóa tìm kiếm
      </Text>
    </EmptyState>
  );
};
