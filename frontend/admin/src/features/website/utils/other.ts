import { ArticleImageRequest } from "app/features/website/types";
import { getMediaResizedImage, ResizedImageType } from "app/utils/url";

export const convertTemplateKeyToName = (key: string) => {
  return key.replace("templates/", "").replace(".bwt", "");
};

export const getImageSrc = (image?: ArticleImageRequest, size: ResizedImageType = "compact"): string => {
  if (!image) return "";
  if (image.src) {
    return image.id ? getMediaResizedImage(image.src, size) : image.src;
  } else if (image.base64) {
    return `data:${image.file?.type || ""};base64,${image.base64}`;
  }
  return "";
};
