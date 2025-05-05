import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { Card, Checkbox, FormLayout, Text, TextField } from "@/ui-components";

import { useTenant } from "app/utils/useTenant";
import { useToggle } from "app/utils/useToggle";

import {
  ALIAS_MAX_LENGTH,
  SEO_DESCRIPTION_MAX_LENGTH,
  SEO_TITLE_MAX_LENGTH,
  toAlias,
  toSeoDescription,
  toSeoTitle,
} from "../utils/text";

type SeoValue = {
  title?: string;
  description?: string;
  alias?: string;
  redirectNewAlias?: boolean;
};

type Props = {
  type: "page" | "article" | "blog";
  inheritFrom: SeoValue;
  value: SeoValue;
  onChange(value: SeoValue): void;
};

const subjectMap: Record<Props["type"], string> = {
  page: "trang nội dung",
  article: "bài viết",
  blog: "danh mục bài viết",
};

export function SeoCard({ type, value, onChange, inheritFrom }: Props) {
  const { getOnlineStoreUrl } = useTenant();
  const { value: isExpand, setTrue: setExpandTrue } = useToggle(false);

  const [pendingAlias, setPendingAlias] = useState<string>();

  const titleInfo = useMemo(() => {
    if (value.title) {
      return {
        inherited: false,
        value: value.title,
      };
    }
    return {
      inherited: true,
      value: inheritFrom.title ? toSeoTitle(inheritFrom.title) : "",
    };
  }, [inheritFrom.title, value.title]);

  const descriptionInfo = useMemo(() => {
    const suggestValue = inheritFrom.description ? toSeoDescription(inheritFrom.description) : "";
    if (value.description) {
      return {
        inherited: false,
        value: value.description,
        suggestValue,
      };
    }
    return {
      inherited: true,
      value: suggestValue,
      suggestValue,
    };
  }, [inheritFrom.description, value.description]);

  const aliasInfo = useMemo(() => {
    const suggestValue = inheritFrom.title ? toAlias(inheritFrom.title) : "";
    if (value.alias) {
      return {
        inherited: false,
        value: value.alias,
        suggestValue,
      };
    }
    if (inheritFrom.alias) {
      return {
        inherited: true,
        value: inheritFrom.alias,
        suggestValue,
      };
    }

    return {
      inherited: true,
      value: suggestValue,
      suggestValue,
    };
  }, [inheritFrom.alias, inheritFrom.title, value.alias]);

  const shouldRedirect = inheritFrom.alias && value.alias && inheritFrom.alias !== value.alias;

  return (
    <Card
      title="Xem trước kết quả tìm kiếm"
      actions={!isExpand ? [{ content: "Tùy chỉnh SEO", onAction: setExpandTrue }] : undefined}
    >
      <Card.Section>
        {titleInfo.value ? (
          <StyledPreviewWrapper>
            <StyledTitleWrapper>
              <Text variant="bodyLg" as="p" fontWeight="medium" truncate>
                {titleInfo.value}
              </Text>
            </StyledTitleWrapper>
            <StyledDescriptionWrapper>
              <Text as="p" breakWord>
                {getOnlineStoreUrl(`/${aliasInfo.value}`)}
              </Text>
            </StyledDescriptionWrapper>
            {descriptionInfo.value ? (
              <Text as="p" color="subdued" breakWord>
                {descriptionInfo.value}
              </Text>
            ) : null}
          </StyledPreviewWrapper>
        ) : (
          <Text as="p">
            {isExpand
              ? `Xin hãy nhập tiêu đề để xem trước kết quả tìm kiếm của ${subjectMap[type]} này.`
              : `Thiết lập các thẻ mô tả giúp khách hàng dễ dàng tìm thấy ${subjectMap[type]} trên công cụ tìm kiếm như Google`}
          </Text>
        )}
      </Card.Section>
      {isExpand && (
        <Card.Section>
          <FormLayout>
            <StyledFieldWrapper>
              <TextField
                label="Tiêu đề trang"
                maxLength={SEO_TITLE_MAX_LENGTH}
                value={value.title ?? ""}
                placeholder={titleInfo.value}
                onChange={(text) =>
                  onChange({
                    ...value,
                    title: text,
                  })
                }
              />
              <StyledRightLabel>
                Số ký tự đã dùng {titleInfo.inherited ? 0 : titleInfo.value.length}/{SEO_TITLE_MAX_LENGTH}
              </StyledRightLabel>
            </StyledFieldWrapper>

            <StyledFieldWrapper>
              <TextField
                label="Thẻ mô tả"
                maxLength={SEO_DESCRIPTION_MAX_LENGTH}
                multiline={3}
                value={value.description ?? ""}
                placeholder={descriptionInfo.value}
                onChange={(text) =>
                  onChange({
                    ...value,
                    description: text,
                  })
                }
                onFocus={() => {
                  onChange({
                    ...value,
                    description: descriptionInfo.value,
                  });
                }}
                onBlur={() => {
                  if (value.description === descriptionInfo.suggestValue) {
                    onChange({
                      ...value,
                      description: "",
                    });
                  }
                }}
              />
              <StyledRightLabel>
                Số ký tự đã dùng {descriptionInfo.inherited ? 0 : descriptionInfo.value.length}/
                {SEO_DESCRIPTION_MAX_LENGTH}
              </StyledRightLabel>
            </StyledFieldWrapper>
            <TextField
              prefix={getOnlineStoreUrl("/")}
              label="Đường dẫn / Alias"
              maxLength={ALIAS_MAX_LENGTH}
              value={pendingAlias !== undefined ? pendingAlias : value.alias ?? ""}
              placeholder={aliasInfo.value}
              onChange={(text) => {
                if (inheritFrom.alias) {
                  const newAlias = text ? text : aliasInfo.suggestValue;
                  setPendingAlias(text);
                  onChange({
                    ...value,
                    alias: newAlias,
                    redirectNewAlias: inheritFrom.alias !== newAlias,
                  });
                } else {
                  onChange({
                    ...value,
                    alias: text,
                  });
                }
              }}
              onBlur={() => setPendingAlias(undefined)}
            />
            {shouldRedirect ? (
              <Checkbox
                label={
                  <Text as="p">
                    Tạo chuyển hướng 301 cho{" "}
                    <Text as="span" fontWeight="bold">
                      {inheritFrom.alias}
                    </Text>{" "}
                    tới{" "}
                    <Text as="span" fontWeight="bold">
                      {value.alias}
                    </Text>
                  </Text>
                }
                checked={value.redirectNewAlias}
                onChange={(checked) =>
                  onChange({
                    ...value,
                    redirectNewAlias: checked,
                  })
                }
              />
            ) : null}
          </FormLayout>
        </Card.Section>
      )}
    </Card>
  );
}

const StyledPreviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${(p) => p.theme.spacing(0.5)};
`;

const StyledTitleWrapper = styled.div`
  color: #1a17ab;
`;

const StyledDescriptionWrapper = styled.div`
  color: #0a8052;
`;

const StyledFieldWrapper = styled.div`
  position: relative;
`;

const StyledRightLabel = styled.p`
  position: absolute;
  top: 0;
  right: 0;
  color: ${(p) => p.theme.colors.textSubdued};
`;
