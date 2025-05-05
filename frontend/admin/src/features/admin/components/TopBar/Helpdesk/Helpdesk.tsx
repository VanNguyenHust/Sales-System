import styled from "@emotion/styled";
import { ActionList, Collapsible, Icon, Link, Popover, Sheet, Text, useTheme } from "@/ui-components";
import {
  ArrowChevronDownIcon,
  ArrowChevronRightIcon,
  CommentIcon,
  HelpCircleIcon,
  HelpCircleOutlineIcon,
  PhoneIcon,
  SupportAgentIcon,
  UserCircleIcon,
} from "@/ui-icons";

import { StopPropagation } from "app/components/StopPropagation";
import { useToggle } from "app/utils/useToggle";

import { SAPO_HOTLINE } from "../../../../../constants";
import { MenuItem } from "../MenuItem";

import { FeedbackModal } from "./FeedbackModal";
import { Sidebar } from "./Sidebar";

export const Helpdesk = () => {
  const theme = useTheme();
  const { value: isOpenHelpdesk, setTrue: openHelpdesk, setFalse: closeHelpdesk } = useToggle(false);
  const { value: isOpenFeedback, setTrue: openFeedback, setFalse: closeFeedback } = useToggle(false);
  const { value: isOpenSidebar, setTrue: openSidebar, setFalse: closeSidebar } = useToggle(false);
  const { value: isOpenGuideLine, toggle: toggleGuideLine, setFalse: closeGuideLine } = useToggle(false);

  const handleCloseHelpdesk = () => {
    closeGuideLine();
    closeHelpdesk();
  };

  return (
    <>
      <Popover
        active={isOpenHelpdesk}
        onClose={handleCloseHelpdesk}
        preferredAlignment="center"
        preferredPosition="below"
        fullHeight
        activator={<MenuItem icon={HelpCircleIcon} onClick={isOpenHelpdesk ? handleCloseHelpdesk : openHelpdesk} />}
      >
        <StopPropagation>
          <StyledWrapper>
            <ActionList
              items={[
                {
                  icon: HelpCircleOutlineIcon,
                  content: "Trung tâm trợ giúp",
                  onAction: () => {
                    handleCloseHelpdesk();
                    openSidebar();
                  },
                },
                {
                  icon: CommentIcon,
                  content: "Đóng góp ý kiến",
                  onAction: () => {
                    handleCloseHelpdesk();
                    openFeedback();
                  },
                },
                {
                  prefix: <Icon source={UserCircleIcon} />,
                  content: "Dành cho khách hàng mới",
                  suffix: isOpenGuideLine ? (
                    <Icon source={ArrowChevronDownIcon} />
                  ) : (
                    <Icon source={ArrowChevronRightIcon} />
                  ),
                  onAction: toggleGuideLine,
                  helpText: (
                    <StyledHelpTextGuideLine>
                      <Text as="span" color="subdued" variant="bodySm">
                        Cùng Sapo làm quen phần mềm qua các bước đơn giản
                      </Text>
                      <Collapsible
                        open={isOpenGuideLine}
                        id="CollapsibleGuideLine"
                        transition={{
                          duration: theme.motion.duration200,
                          timingFunction: theme.motion.transformEaseInOut,
                        }}
                      >
                        <Link onClick={handleCloseHelpdesk} url="/admin/products/create?show_guide=true">
                          Thêm sản phẩm
                        </Link>
                        <Link onClick={handleCloseHelpdesk} url="/admin/orders/create?show_guide=true">
                          Tạo đơn hàng
                        </Link>
                      </Collapsible>
                    </StyledHelpTextGuideLine>
                  ),
                },
              ]}
            />
            <StyledHotline>
              <Link url={`tel:${SAPO_HOTLINE}`} removeUnderline>
                <Icon source={PhoneIcon} />
                {SAPO_HOTLINE}
              </Link>
              <Link url="https://support.sapo.vn/createticket.html" external removeUnderline>
                <Icon source={SupportAgentIcon} />
                Gửi hỗ trợ
              </Link>
            </StyledHotline>
          </StyledWrapper>
        </StopPropagation>
      </Popover>
      {isOpenFeedback ? <FeedbackModal open={isOpenFeedback} onClose={closeFeedback} /> : null}
      <Sheet open={isOpenSidebar} onClose={closeSidebar}>
        <Sidebar onClose={closeSidebar} />
      </Sheet>
    </>
  );
};

const StyledWrapper = styled.div`
  width: calc(${(p) => p.theme.spacing(10)} * 7);
  min-width: calc(${(p) => p.theme.spacing(10)} * 7 - 2px);
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  ${(p) => p.theme.breakpoints.down("sm")} {
    width: initial;
  }
  ul {
    display: flex;
    flex-direction: column;
    gap: ${(p) => p.theme.spacing(2)};
    li {
      button {
        & > div {
          flex-wrap: nowrap;
          align-items: flex-start;
          span:first-child {
            margin: 0;
          }
        }
      }
    }
  }
`;

const StyledHotline = styled.div`
  background: ${(p) => p.theme.colors.surfaceSubdued};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(p) => p.theme.spacing(2, 4)};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  line-height: ${(p) => p.theme.spacing(6)};
  a {
    display: flex;
    gap: ${(p) => p.theme.spacing(1)};
    font-weight: ${(p) => p.theme.typography.fontWeightMedium};
    svg {
      fill: ${(p) => p.theme.colors.icon};
      color: ${(p) => p.theme.colors.icon};
    }
  }
`;

const StyledHelpTextGuideLine = styled.span`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing(1)};
  margin-top: ${(p) => p.theme.spacing(1)};
  a {
    height: ${(p) => p.theme.spacing(8)};
    display: flex;
    align-items: center;
    text-decoration: none;
    color: ${(p) => p.theme.colors.text};
  }
`;
