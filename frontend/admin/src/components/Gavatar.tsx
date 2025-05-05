import { useState } from "react";
import { Avatar, type AvatarProps } from "@/ui-components";
import { MD5 } from "crypto-js";

import emptyAvatarURL from "app/assets/images/empty-avatar.png?url";
import { IS_PROD } from "app/constants";

type Props = Pick<AvatarProps, "initials" | "size"> & {
  email?: string;
};

//TODO: change to import asset when available, see: https://github.com/vitejs/vite/issues/2173
const publicEmptyUrl = `${import.meta.env.VITE_MEDIA_BASE_URL}/empty-avatar.png`;

export function Gavatar({ email, ...rest }: Props) {
  const [isError, setError] = useState(false);
  if (email) {
    const { size } = rest;
    const s = size === "small" ? 34 : 40;

    // development mode, url is local but gavatar want global url, so we fallback to 404 in development mode
    const d = IS_PROD ? publicEmptyUrl : 404;
    const hashcode = MD5(email);
    const gUrl = `https://secure.gravatar.com/avatar/${hashcode}.jpg?s=${s}&d=${d}`;
    return <Avatar {...rest} source={!isError ? gUrl : emptyAvatarURL} onError={() => setError(true)} />;
  }
  return <Avatar {...rest} source={emptyAvatarURL} />;
}
