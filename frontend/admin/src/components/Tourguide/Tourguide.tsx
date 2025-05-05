import { useCallback } from "react";
import Joyride, {
  ACTIONS,
  type BeaconRenderProps,
  EVENTS,
  type Props as JoyrideProps,
  STATUS as STATUSTOUR,
  type TooltipRenderProps,
} from "react-joyride";
import { useTheme } from "@/ui-components";

import { Beacon } from "./Beacon";
import { Tooltip } from "./Tooltip";
import { StepProps, TourguideCallback } from "./type";

type TourguideProps = JoyrideProps & {
  /* Hiển thị arrow của tooltip */
  arrow?: boolean;
  /* Spotlight viền xanh bao quanh element. Nếu = false thì sẽ dùng mặc định của lib */
  onlySpotlight?: boolean;
  /* Danh sách các bước */
  steps: StepProps[];
};

export const Tourguide = (props: TourguideProps) => {
  const { arrow, onlySpotlight, styles, floaterProps } = props;
  window.global ||= window;
  const theme = useTheme();

  const swapNodeIfNeed = useCallback(() => {
    const swapNode = () => {
      const container =
        props.container instanceof HTMLElement
          ? props.container
          : props.container
          ? document.querySelector(props.container)
          : null;
      if (container) {
        const contentNodeOld = container?.querySelector('[id^="react-joyride-step"]');
        const contentNode = document.querySelector('body > [id^="react-joyride-step"]');
        if (contentNode) {
          if (contentNodeOld) {
            contentNodeOld.remove();
          }
          container.appendChild(contentNode);
        }
      }
    };
    swapNode();
  }, [props.container]);

  const removeContentNode = () => {
    const container =
      props.container instanceof HTMLElement
        ? props.container
        : props.container
        ? document.querySelector(props.container)
        : null;
    const bodyContentNode = document.querySelector('body > [id^="react-joyride-step"]');
    if (bodyContentNode && container) {
      bodyContentNode.remove();
    }
  };

  const handleCallback = async (data: TourguideCallback) => {
    const { action, index, type, status } = data;
    if (props.callback) {
      props.callback(data);
    }
    if (
      (ACTIONS.UPDATE === action && EVENTS.TOOLTIP === type && STATUSTOUR.RUNNING === status) ||
      (props.stepIndex && index === props.stepIndex) ||
      (!props.stepIndex && index === 0)
    ) {
      swapNodeIfNeed();
      if ((props.stepIndex && index === props.stepIndex) || (!props.stepIndex && index === 0)) {
        removeContentNode();
      }
    }
  };

  return (
    <Joyride
      {...props}
      callback={handleCallback}
      beaconComponent={Beacon as React.ElementType<BeaconRenderProps>}
      styles={{
        ...styles,
        ...(onlySpotlight
          ? {
              overlay: {
                background: "transparent",
                pointerEvents: "none",
                mixBlendMode: "normal",
                maxHeight: "100%",
              },
              spotlight: {
                background: "transparent",
                border: `2px solid ${theme.colors.textSuccess}`,
                borderRadius: theme.spacing(2),
              },
            }
          : {
              overlay: {
                maxHeight: "100%",
                ...styles?.overlay,
              },
            }),
      }}
      spotlightClicks
      floaterProps={{
        ...floaterProps,
        hideArrow: !arrow,
        styles: {
          ...floaterProps?.styles,
          floater: {
            ...floaterProps?.styles?.floater,
            position: "absolute",
            top: 0,
            left: 0,
          },
          ...(arrow
            ? {
                floaterOpening: {
                  padding: 0,
                },
              }
            : {}),
          arrow: {
            display: "none",
          },
        },
      }}
      tooltipComponent={Tooltip as React.ElementType<TooltipRenderProps>}
    />
  );
};
