import { useEffect, useMemo, useRef } from "react";
import { matchRoutes } from "react-router-dom";
import { type RouteObject } from "react-router-dom";
import styled from "@emotion/styled";
import DOMPurify from "dompurify";

import { isSapoMobileBridge } from "app/utils/mobile";
import { useNavigate } from "app/utils/useNavigate";
import { useTenant } from "app/utils/useTenant";

interface Props {
  content: string;
}

/**
 * - Render nội dung html nhận từ api một cách an toàn
 * - Xử lý link click
 * */
export function SafeHtmlContent({ content }: Props) {
  const sanitizedContent = useMemo(() => DOMPurify.sanitize(content, { ADD_ATTR: ["target"] }), [content]);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { getAdminRelativePath } = useTenant();
  useEffect(() => {
    if (ref.current) {
      const links = ref.current.getElementsByTagName("a");
      for (const link of links) {
        const adminRelativePath = getAdminRelativePath(link.href);
        link.onclick = (e) => {
          // if relative link then using client side navigate
          if (link.target !== "_blank") {
            e.preventDefault();
            if (adminRelativePath) {
              // don't duplicate same link
              if (location.pathname !== adminRelativePath) {
                // should open new tab for download link
                if (isDownloadPath(adminRelativePath)) {
                  window.open(adminRelativePath);
                } else {
                  navigate(adminRelativePath);
                }
              }
            } else {
              if (isSapoMobileBridge) {
                navigate(link.href);
              } else {
                // should open new tab for external link in web
                window.open(link.href);
              }
            }
          }
        };
      }
    }
  }, [getAdminRelativePath, navigate]);
  return (
    <StyledSafeHtmlContent
      ref={ref}
      dangerouslySetInnerHTML={{
        __html: sanitizedContent,
      }}
    />
  );
}

const downloadPaths: RouteObject[] = [
  {
    path: "/admin/customers/download/:fileName",
  },
  {
    path: "/admin/products/download/:fileName",
  },
  {
    path: "/admin/orders/download/:fileName",
  },
  {
    path: "/admin/draft_orders/download/:fileName",
  },
  {
    path: "/admin/shipments/download/:fileName",
  },
  {
    path: "/admin/vouchers/download/:fileName",
  },
  {
    path: "/admin/catalogs/download/:fileName",
  },
];

export function isDownloadPath(path: string) {
  return !!matchRoutes(downloadPaths, path);
}

const StyledSafeHtmlContent = styled.div`
  a {
    appearance: none;
    display: inline;
    text-align: inherit;
    padding: 0;
    background: none;
    border: 0;
    font-size: inherit;
    font-weight: inherit;
    color: ${(p) => p.theme.colors.interactive};
    text-decoration: none;
    cursor: pointer;
    &:hover {
      color: ${(p) => p.theme.colors.interactiveHovered};
      text-decoration: underline;
    }
    &:focus:not(:active) {
      outline: ${(p) => p.theme.colors.focused} auto ${(p) => p.theme.shape.borderRadius(1)};
    }

    &:active {
      position: relative;
      color: ${(p) => p.theme.colors.interactivePressed};
    }
  }
`;
