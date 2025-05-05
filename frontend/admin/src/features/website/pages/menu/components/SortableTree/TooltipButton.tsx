import { Button, type IconSource, Tooltip } from "@/ui-components";

type Props = {
  tooltip: string;
  icon: IconSource;
  onClick(): void;
};

export const TooltipButton = ({ tooltip, icon, onClick }: Props) => {
  return (
    <Tooltip content={tooltip} dismissOnMouseOut activatorWrapper="span">
      <Button icon={icon} plain onClick={onClick} />
    </Tooltip>
  );
};
