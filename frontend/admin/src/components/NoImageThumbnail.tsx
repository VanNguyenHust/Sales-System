import { Thumbnail, type ThumbnailProps } from "@/ui-components";

import NoImage from "app/assets/images/no-image.svg";

type Props = Without<ThumbnailProps, "source">;

export const NoImageThumbnail = ({ size = "small", ...rest }: Props) => {
  return <Thumbnail source={NoImage} {...rest} size={size} />;
};
