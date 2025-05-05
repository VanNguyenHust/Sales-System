import { SetStateAction, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Box, Button, Icon, InlineStack, Spinner, Stack, Text, useBreakpoints } from "@/ui-components";
import { ArrowCaretLeftIcon, ArrowCaretRightIcon, DoneAllIcon, StarMultipleIcon } from "@/ui-icons";

import emptyFeeSettingUrl from "app/assets/images/empty-fee-setting.svg";
import { StyledSuggestBodyRightLoading, StyledSuggestBodySeparator } from "app/components/AISuggestTextField";
import { PreviewHtml } from "app/components/PreviewHtml";
import { useTenant } from "app/utils/useTenant";

import { AIContextType } from "./context";

type Props = {
  wasCalled: boolean;
  suggestions: string[];
  currentSuggestionIndex: number;
  onApplySuggestion?: AIContextType["onApplySuggestion"];
  loading: boolean;
  setCurrentSuggestionIndex: (value: SetStateAction<number>) => void;
  showNotEnoughPointPost?: boolean;
};

const PROFILES_URL = import.meta.env.VITE_SSO_PROFILE_URL;

export const SuggestPreview = ({
  wasCalled,
  suggestions,
  currentSuggestionIndex,
  onApplySuggestion,
  loading,
  setCurrentSuggestionIndex,
  showNotEnoughPointPost,
}: Props) => {
  const { tenant } = useTenant();

  const { lgUp } = useBreakpoints();

  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    const suggestBodyLeft = document.querySelector(".suggest-body-left");
    if (suggestBodyLeft) {
      setHeight(suggestBodyLeft.clientHeight - 16);
    }
  }, []);

  const allowPrev = currentSuggestionIndex > 1;
  const allowNext = currentSuggestionIndex < suggestions.length;
  if (!wasCalled) return null;

  return (
    <SuggestionBody>
      <StyledSuggestBodySeparator />
      <StyledSuggestBodyRight>
        {loading ? (
          <StyledSuggestBodyRightLoading>
            <div className="suggest-body-right-spinner">
              <Spinner size="small" />
            </div>
            <Text as="span">Đang tạo nội dung bài viết</Text>
          </StyledSuggestBodyRightLoading>
        ) : (
          <>
            {showNotEnoughPointPost ? (
              <StyledNotEnoughPointPost>
                <img src={emptyFeeSettingUrl} alt="empty-fee-setting" />
                <Text as="span" variant="bodyMd" color="subdued" alignment="center">
                  Điểm của bạn không đủ để sử dụng tính năng AI. Vui lòng mua thêm điểm để tiếp tục sử dụng.
                </Text>
                <Button primary url={`${PROFILES_URL}/stores/${tenant.sapo_domain}/ai`}>
                  Mua thêm điểm ngay
                </Button>
              </StyledNotEnoughPointPost>
            ) : (
              <StyledSuggestBodyRightContent height={height}>
                <Stack distribution="equalSpacing">
                  <Stack.Item>
                    <Stack spacing="tight" alignment="fill">
                      <Icon source={StarMultipleIcon} color="primary" />
                      <Text as="span" variant="headingSm">
                        Nội dung bài viết
                      </Text>
                    </Stack>
                  </Stack.Item>
                  {suggestions.length > 1 && (
                    <Stack.Item>
                      <Stack spacing="none" alignment="fill">
                        <div
                          onClick={() => {
                            if (allowPrev) {
                              setCurrentSuggestionIndex((prev) => prev - 1);
                            }
                          }}
                          style={{ cursor: allowPrev ? "pointer" : "not-allowed" }}
                        >
                          <Icon source={ArrowCaretLeftIcon} color={allowPrev ? undefined : "subdued"} />
                        </div>
                        {currentSuggestionIndex}/{suggestions.length}
                        <div
                          onClick={() => {
                            if (allowNext) {
                              setCurrentSuggestionIndex((prev) => prev + 1);
                            }
                          }}
                          style={{ cursor: allowNext ? "pointer" : "not-allowed" }}
                        >
                          <Icon source={ArrowCaretRightIcon} color={allowNext ? undefined : "subdued"} />
                        </div>
                      </Stack>
                    </Stack.Item>
                  )}
                </Stack>
                <Box borderRadius="base" maxHeight={`calc(${height}px - 84px)`} overflowX="hidden">
                  {height > 0 && (
                    <PreviewHtml
                      viewMode="disabled"
                      value={suggestions[currentSuggestionIndex - 1] || ""}
                      height={height - 84}
                      maxHeight={height - 84}
                    />
                  )}
                </Box>
                {!lgUp && (
                  <InlineStack align="end">
                    <Button
                      icon={DoneAllIcon}
                      primary
                      onClick={() => {
                        onApplySuggestion?.(suggestions[currentSuggestionIndex - 1]);
                      }}
                    >
                      Áp dụng
                    </Button>
                  </InlineStack>
                )}
              </StyledSuggestBodyRightContent>
            )}
          </>
        )}
      </StyledSuggestBodyRight>
      {lgUp && (
        <div style={{ position: "absolute", bottom: 0, right: 0, padding: "16px" }}>
          <Button
            icon={DoneAllIcon}
            primary
            onClick={() => {
              onApplySuggestion?.(suggestions[currentSuggestionIndex - 1]);
            }}
          >
            Áp dụng
          </Button>
        </div>
      )}
    </SuggestionBody>
  );
};

const StyledSuggestBodyRightContent = styled.div<{ height: number }>`
  display: grid;
  gap: 12px;
`;

const StyledSuggestBodyRight = styled.div`
  position: relative;

  ${(p) => p.theme.breakpoints.up("lg")} {
    width: 688px;
  }

  ${(p) => p.theme.breakpoints.down("lg")} {
    max-width: 688px;
  }
  ${(p) => p.theme.breakpoints.down("md")} {
    width: 100%;
  }
`;
const SuggestionBody = styled.div`
  display: flex;
  ${(p) => p.theme.breakpoints.down("lg")} {
    width: 100%;
    display: grid;
    grid-template-columns: 16px auto;
    gap: 16px;
  }

  ${(p) => p.theme.breakpoints.down("md")} {
    display: flex;
    flex-direction: column;
  }
`;
const StyledNotEnoughPointPost = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 40px;
`;
