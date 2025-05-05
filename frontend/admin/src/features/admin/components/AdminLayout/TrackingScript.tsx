import { Helmet } from "react-helmet-async";

import { IS_PROD } from "app/constants";
import { isSapoMobileBridge } from "app/utils/mobile";

import { CLARITY_KEY } from "./contants";

export const TrackingScript = () => {
  return IS_PROD && !!CLARITY_KEY && !isSapoMobileBridge ? (
    <Helmet>
      <script type="text/javascript">{`(function(c,l,a,r,i,t,y){ c[a]=c[a]||function()

          {(c[a].q=c[a].q||[]).push(arguments)}
          ; t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i; y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y); })(window, document, "clarity", "script", "${CLARITY_KEY}");`}</script>
    </Helmet>
  ) : null;
};
