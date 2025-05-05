import type { CallBackProps, Step } from "react-joyride";

export type TourguideCallback = CallBackProps;

export type Placement = Step["placement"] | "bottom-left" | "bottom-right" | "top-left" | "top-right";

export type StepProps = Step & {
  placement?: Placement;
};
