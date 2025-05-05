import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Frame, Layout, Page, Stack, Text } from "@/ui-components";

import { useGetStoreSettingsQuery } from "app/api";
import spinnerBackgroundImage from "app/assets/images/processing.svg";
import { AppLayout } from "app/components/AppLayout";
import { DecoratedSpinner } from "app/components/DecoratedSpinner";
import { DocumentTitle } from "app/components/DocumentTitle";

import { SETTING_KEY_MIGRATE_STATUS } from "./Onboarding/types";

export function MigrateRunningPage() {
  const [isCompleted, setIsCompleted] = useState(false);
  const { data: migrateSetting = [], isFetching } = useGetStoreSettingsQuery([SETTING_KEY_MIGRATE_STATUS], {
    pollingInterval: 5000,
    skip: isCompleted,
  });

  useEffect(() => {
    if (!isFetching && migrateSetting.length && migrateSetting[0].setting_value === "completed") {
      setIsCompleted(true);
      location.reload();
    }
  }, [migrateSetting, isFetching]);

  return (
    <AppLayout>
      <Frame>
        <Page>
          <DocumentTitle title="Nâng cấp cửa hàng" />
          <StyledContainer>
            <Layout>
              <Layout.Section oneHalf>
                <StyledContentContainer>
                  <Stack vertical alignment="center">
                    <StyledLoadingWrapper>
                      <img src={spinnerBackgroundImage} />
                      <StyledSpinnerContainer>
                        <StyledSpinnerWrapper>
                          <DecoratedSpinner />
                          <StyledTextWrapper>
                            <Text as="p">ĐANG XỬ LÝ...</Text>
                          </StyledTextWrapper>
                        </StyledSpinnerWrapper>
                      </StyledSpinnerContainer>
                    </StyledLoadingWrapper>
                    <Text as="h1" variant="heading2xl">
                      Dữ liệu cửa hàng đang được nâng cấp
                    </Text>
                    <Text as="p" variant="bodyMd">
                      Bạn vui lòng quay lại sau ít phút nữa
                    </Text>
                  </Stack>
                </StyledContentContainer>
              </Layout.Section>
            </Layout>
          </StyledContainer>
        </Page>
      </Frame>
    </AppLayout>
  );
}

const StyledContainer = styled.div`
  min-height: 90vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
  ${(p) => p.theme.breakpoints.down("md")} {
    padding: ${(p) => p.theme.spacing(5, 0)};
  }

  & > div {
    height: 100%;
    width: 100%;
    align-items: center;
  }
  & > div > div {
    height: 100%;
  }
`;

const StyledContentContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
`;

const StyledLoadingWrapper = styled.div`
  position: relative;
  width: fit-content;
`;

const StyledSpinnerContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const StyledSpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${(p) => p.theme.spacing(2)};
`;

const StyledTextWrapper = styled.div`
  color: #5379ff;
  & > p {
    font-size: 450;
    font-weight: 500;
    font-family: system-ui;
  }
`;
