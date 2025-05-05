import { FooterHelp as FooterHelpCpn, Link } from "@/ui-components";

interface Props {
  resource: string;
  url: string;
  /**
   * @default true
   */
  external?: boolean;
}

export const FooterHelp = ({ resource, url, external = true }: Props) => (
  <FooterHelpCpn>
    Tìm hiểu thêm về&nbsp;
    <Link external={external} removeUnderline url={url}>
      {resource}
    </Link>
  </FooterHelpCpn>
);
