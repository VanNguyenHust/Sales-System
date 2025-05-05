import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { differenceInDays } from "date-fns";

import { useGetStoreChannelsQuery } from "app/api";
import { IS_PROD } from "app/constants";
import { isSapoMobileBridge } from "app/utils/mobile";
import { isTrialPackageWithPackageId } from "app/utils/package";
import { useCurrentUser } from "app/utils/useCurrentUser";
import { useTenant } from "app/utils/useTenant";

export const Chatbot = () => {
  const { tenant } = useTenant();
  const currentUser = useCurrentUser();
  const { data: storeChannels, isLoading: isLoadingStoreChannels } = useGetStoreChannelsQuery();

  const { isTrial, daysLeft } = useMemo(() => {
    const websiteChannel = storeChannels?.find((channel) => channel.sale_channel === "website");
    const isTrial = isTrialPackageWithPackageId(websiteChannel?.store_package_id ?? 0);
    const daysLeft =
      websiteChannel && websiteChannel.end_date
        ? differenceInDays(new Date(websiteChannel?.end_date ?? ""), new Date())
        : 0;
    return { websiteChannel, isTrial, daysLeft };
  }, [storeChannels]);

  return IS_PROD && !isLoadingStoreChannels && !isTrial && !isSapoMobileBridge ? (
    <Helmet>
      <style>
        {`#fc_frame:not(.h-open-container), #fc_frame.fc-widget-normal:not(.h-open-container) {
              bottom: 75px !important;
              right: 0 !important;
              z-index: 518 !important;
              height: 35px !important;
              width: 35px !important;
              min-height: 35px !important;
              min-width: 35px !important;
          }`}
      </style>
      <script type="text/javascript">
        {`window.fcSettings = {
            config: {
              content: {
                actions: {
                  csat_no: "Không",
                  csat_submit: "Gửi",
                  csat_yes: "Có",
                  push_notify_no: "Không",
                  push_notify_yes: "Có",
                },
                headers: {
                  channel_response: {
                    offline: "Sapo sẽ phản hồi anh chị trong thời gian sớm nhất!",
                    online: {
                      hours: {
                        more: "Sapo sẽ phản hồi anh chị trong thời gian sớm nhất!",
                        one: "Sapo sẽ phản hồi anh chị trong thời gian sớm nhất!",
                      },
                      minutes: {
                        more: "Sapo sẽ phản hồi anh chị trong thời gian sớm nhất!",
                        one: "Sapo sẽ phản hồi anh chị trong thời gian sớm nhất!",
                      },
                    },
                  },
                  chat: "Hỗ trợ Sapo",
                  csat_no_question: "A/c vui lòng thông tin thêm về TH mình đang không hài lòng để Sapo cải thiện chất lượng DV ạ?",
                  csat_question: "Anh/ chị có hài lòng về chất lượng hỗ trợ của nhân viên chat không ạ?",
                  csat_rate_here: "Gửi",
                  csat_thankyou: "Cảm ơn anh chị đã đánh giá, Sapo sẽ nỗ lực nâng cao chất lượng dịch vụ hơn nữa!",
                  csat_yes_question: "A/c vui lòng đánh giá theo thang điểm từ 1 đến 5 và để lại lời nhắn để Sapo cải thiện hơn chất lượng dịch vụ ạ!",
                  push_notification: "Đồng ý nhận thông báo khi có phản hồi từ Sapo?",
                },
                placeholders: {
                  csat_reply: "Góp ý thêm",
                  reply_field: "Trả lời",
                  search_field: "Tìm kiếm",
                },
              },
              cssNames: {
                widget: "custom_fc_frame",
                expanded: "custom_fc_expanded",
              },
            },
            host: "https://wchat.freshchat.com",
            token: "67eb1166-0afc-42a6-bbfe-5a18f0236462",
            onInit: function () {
              window.fcWidget.user.setProperties({
                team: "${daysLeft > 60 && daysLeft < 180 ? "WEB2" : daysLeft >= 180 ? "WEB3" : "WEB1"}",
                firstName: "${currentUser.name}",
                lastName: "${tenant.sapo_domain}",
                email: "${currentUser.email ?? ""}",
                phone: "${currentUser.phone_number ?? ""}",
              });
            },
          };`}
      </script>
      <script type="text/javascript" src="https://wchat.freshchat.com/js/widget.js" />
    </Helmet>
  ) : null;
};
