import { Thumbnail } from "@/ui-components";

import { getMediaResizedImage } from "app/utils/url";

import { NoImageThumbnail } from "./NoImageThumbnail";

type Props = {
  src?: string;
  alt?: string;
};

export function ProductThumbnail({ src, alt }: Props) {
  return src ? (
    <Thumbnail alt={alt ?? ""} size="small" source={getMediaResizedImage(src, "thumb")} />
  ) : (
    <NoImageThumbnail alt="No Image" />
  );
}
