import { useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Banner, Button, Frame, Text } from "@/ui-components";
import { PosIcon, WebsiteIcon } from "@/ui-icons";

import {
  useCompleteRegistrationMutation,
  useCreateDataOnboardingMutation,
  useUpdateStoreSettingMutation,
} from "app/api";
import FacebookIcon from "app/assets/icon/icon-facebook.svg?react";
import LazadaIconUrl from "app/assets/icon/icon-lazada.svg?url";
import ShopeeIcon from "app/assets/icon/icon-shopee.svg?react";
import TikiIcon from "app/assets/icon/icon-tiki.svg?react";
import TiktokIcon from "app/assets/icon/icon-tiktok.svg?react";
import LogoSapoUrl from "app/assets/icon/sapo-logo.svg";
import { isClientError } from "app/client";
import { DocumentTitle } from "app/components/DocumentTitle";
import { showErrorToast } from "app/utils/toast";
import { useFeatureFlag } from "app/utils/useFeatureFlag";

import { CardContent } from "./CardContent";
import { ChannelItem } from "./ChannelItem";
import { ChannelEnum, ChannelOption, PackageTitle, SETTING_KEY_ONBOARDING, StatusOnBoarding } from "./types";

export const Onboarding = ({ packageTitle }: { packageTitle?: string }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isEnabledFeature } = useFeatureFlag();

  const channelOptions: ChannelOption[] = [
    {
      icon: <TiktokIcon />,
      value: ChannelEnum.TIKTOKSHOP,
      title: "Kênh TikTok Shop",
      description: "Bán hàng trên sàn TikTok Shop",
      disabled: !isEnabledFeature("use_market_place_channel"),
    },
    {
      icon: <ShopeeIcon />,
      value: ChannelEnum.SHOPEE,
      title: "Kênh Shopee",
      description: "Bán hàng trên sàn Shopee",
      disabled: !isEnabledFeature("use_market_place_channel"),
    },
    {
      icon: <img src={LazadaIconUrl} />,
      value: ChannelEnum.LAZADA,
      title: "Kênh Lazada",
      description: "Bán hàng trên sàn Lazada",
      disabled: !isEnabledFeature("use_market_place_channel"),
    },
    {
      icon: <TikiIcon />,
      value: ChannelEnum.TIKI,
      title: "Kênh Tiki",
      description: "Bán hàng trên sàn Tiki",
      disabled: !isEnabledFeature("use_market_place_channel"),
    },
    ...(packageTitle === PackageTitle.OMNI_V3
      ? [
          {
            icon: <WebsiteIcon />,
            value: ChannelEnum.ONLINE_STORE,
            title: "Kênh Website",
            description: "Bán hàng trên Website",
            disabled: !isEnabledFeature("use_online_store_channel"),
          },
          {
            icon: <PosIcon />,
            value: ChannelEnum.POS,
            title: "Kênh POS",
            description: "Bán tại cửa hàng",
            disabled: !isEnabledFeature("use_pos_channel"),
          },
          {
            icon: <FacebookIcon />,
            value: ChannelEnum.FACEBOOK,
            title: "Kênh Facebook",
            description: "Bán hàng trên mạng xã hội Facebook",
            disabled: !isEnabledFeature("use_facebook_shopping_channel"),
          },
        ]
      : []),
  ];
  const [channels, setChannels] = useState<ChannelEnum[]>(channelOptions.map((channel) => channel.value));

  const [createDataOnboarding] = useCreateDataOnboardingMutation();
  const [updateStatusOnboarding] = useUpdateStoreSettingMutation();
  const [completeRegistration] = useCompleteRegistrationMutation();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (packageTitle === PackageTitle.OMNI_V3) {
        const preferredServices = getPreferredService(channels);
        if (preferredServices.length > 0) {
          await completeRegistration({
            preferred_service: preferredServices.length > 1 ? "omni" : preferredServices[0],
          }).unwrap();
        }
      }
      await createDataOnboarding({ channels: [...channels, ChannelEnum.SOCIAL] }).unwrap();
      await updateStatusOnboarding({
        setting_key: SETTING_KEY_ONBOARDING,
        setting_value: StatusOnBoarding.COMPLETE,
      }).unwrap();
    } catch (error) {
      setIsSubmitting(false);
      if (isClientError(error)) {
        showErrorToast(error.data.message);
      } else {
        showErrorToast("Có lỗi xảy ra. Vui lòng thử lại sau");
      }
    }
  };

  return (
    <>
      <DocumentTitle title="Khởi tạo cửa hàng" />
      <StyledOnboarding>
        <StyledWrapper>
          <StyledLogo>
            <img src={LogoSapoUrl} alt="Sapo" />
          </StyledLogo>
          <StyledContent>
            <CardContent
              title="Bạn muốn bán hàng trên kênh nào?"
              description={
                <>
                  <Text as="p">
                    Chọn các kênh bán hàng bạn muốn sử dụng, Sapo sẽ giúp bạn cài đặt và sẵn sàng bán hàng trên các kênh
                    này!
                  </Text>
                  {channels.length === 0 ? (
                    <Banner status="info" outline hideDismiss>
                      Vui lòng chọn tối thiểu 1 kênh để cài đặt
                    </Banner>
                  ) : null}
                </>
              }
            >
              <BoxChannels isTwoColumn={packageTitle === PackageTitle.OMNI_V3}>
                {channelOptions.map((channel) => (
                  <ChannelItem
                    key={channel.value}
                    checked={channels.includes(channel.value)}
                    option={channel}
                    onChange={(checked: boolean) => {
                      if (checked) {
                        setChannels([...channels, channel.value]);
                      } else {
                        setChannels(channels.filter((item) => item !== channel.value));
                      }
                    }}
                  />
                ))}
              </BoxChannels>
            </CardContent>
            <StyledActions>
              <Button primary onClick={() => handleSubmit()} disabled={channels.length === 0} loading={isSubmitting}>
                Xác nhận
              </Button>
            </StyledActions>
          </StyledContent>
        </StyledWrapper>
      </StyledOnboarding>
    </>
  );
};

const StyledOnboarding = styled.div`
  background: linear-gradient(58deg, #d5e2ff 27.12%, #f6fff3 137.1%);
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(p) => p.theme.spacing(4, 0)};
  ${(p) => p.theme.breakpoints.down("md")} {
    height: auto;
    min-height: 100vh;
    padding: 0;
    align-items: flex-start;
  }
`;

const StyledWrapper = styled.div`
  width: 900px;
  padding: ${(p) => p.theme.spacing(8, 6)};
  max-width: calc(100% - ${(p) => p.theme.spacing(8)});
  background: ${(p) => p.theme.colors.surface};
  border-radius: ${(p) => p.theme.shape.borderRadius(4)};
  max-height: calc(100vh - ${(p) => p.theme.spacing(8)});
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  ${(p) => p.theme.breakpoints.down("md")} {
    width: 100%;
    max-width: initial;
    height: 100vh;
    max-height: initial;
    display: block;
    border-radius: 0;
  }
`;

const StyledLogo = styled.div`
  margin-bottom: ${(p) => p.theme.spacing(6)};
  ${(p) => p.theme.breakpoints.down("md")} {
    margin-bottom: 0;
    text-align: center;
    img {
      width: ${(p) => p.theme.spacing(32)};
    }
  }
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 155px);
  gap: ${(p) => p.theme.spacing(6)};
  ${(p) => p.theme.breakpoints.down("md")} {
    height: auto;
    max-height: initial;
    padding: ${(p) => p.theme.spacing(4, 4, 6)};
  }
`;

const StyledActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${(p) => p.theme.spacing(4)};
  flex-shrink: 0;
`;

const BoxChannels = styled.div<{ isTwoColumn: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing(3)};
  ${(p) =>
    p.isTwoColumn &&
    css`
      ${p.theme.breakpoints.up("lg")} {
        height: 244px;
        flex-wrap: wrap;
        & > div {
          width: calc(50% - 6px);
        }
      }
    `}
`;

function getPreferredService(channels: ChannelEnum[]) {
  const preferredServices = [];
  for (const channel of channels) {
    switch (channel) {
      case ChannelEnum.TIKTOKSHOP:
      case ChannelEnum.SHOPEE:
      case ChannelEnum.LAZADA:
      case ChannelEnum.TIKI:
        preferredServices.push("sapo_go");
        break;
      case ChannelEnum.POS:
        preferredServices.push("retail_pro");
        break;
      case ChannelEnum.FACEBOOK:
        preferredServices.push("social");
        break;
      case ChannelEnum.ONLINE_STORE:
        preferredServices.push("eweb");
        break;
    }
  }
  return [...new Set(preferredServices)];
}
