import type { RawEditorOptions, TinyMCE } from "@sapo/tinymce";
import content from "@sapo/tinymce/dist/content.css?inline";

import { TEXT_AREA_PAD } from "./types";

import "@sapo/tinymce/dist/skin.css";

export const defaultContentStyle = content.concat(`

@font-face {
  font-family: "Inter";
  font-weight: 100 900;
  font-display: swap;
  font-style: normal;
  font-named-instance: "Regular";
  src: url("https://bizweb.dktcdn.net/static/fonts/inter/Inter-roman.var.woff2?v=3.19") format("woff2");
}
@font-face {
  font-family: "Inter";
  font-weight: 100 900;
  font-display: swap;
  font-style: italic;
  font-named-instance: "Italic";
  src: url("https://bizweb.dktcdn.net/static/fonts/inter/Inter-italic.var.woff2?v=3.19") format("woff2");
}

p {
  margin-top: 0;
}

html, body {
  cursor: text;
}

html {
  font-size: 14px;
}

body {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif;
  line-height: 1.4;
  color: rgb(15, 24, 36); /* Maps to var(--p-color-text) */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: ${TEXT_AREA_PAD}px 12px;
}

/* The body y margin of 0.66rem works well for type, but is too tight for solid elements. Push them down a bit. */
body > img:first-child,
body > iframe:first-child {
  margin-top: .15rem;
}

h1 {
  line-height: 1.2;
}

h1 {
  margin: 0 0 .75rem;
}

h2, h3, h4, h5, h6 {
  margin: 0 0 .66rem 0;
}

p, img, iframe {
  margin: 0 0 1rem;
}

p > img,
p > iframe {
  margin-bottom: 0;
}

body > *:last-child {
  margin-bottom: 0;
}

table {
  width: 100%;
}

table:not([border]),table:not([border]) caption,
table:not([border]) td,table:not([border]) th,table[border="0"],
table[border="0"] caption,table[border="0"] td,table[border="0"] th,
table[style*="border-width: 0px"],table[style*="border-width: 0px"] caption,
table[style*="border-width: 0px"] td,table[style*="border-width: 0px"] th {
  border: 1px dashed #CCC;
  td, th {
    border: 1px dashed #CCC;
  }
}

blockquote {
  border-left: 2px solid #6d737b;
  margin-left: 1.5rem;
  padding-left: 1rem;
}
`);

export const defaultTinymceInitConfig: RawEditorOptions = {
  convert_urls: false,
  schema: "html5",
  entity_encoding: "raw",
  valid_children:
    "+body[style|meta],+div[meta],+object[object|param|embed],+a[span|h1|h2|h3|h4|h5|i|div|article|section|p]",
  valid_elements: "*[*]",
  extended_valid_elements: "#p[*]",
  forced_root_block: "p",
  allow_html_in_named_anchor: true,
  remove_trailing_brs: false,
  browser_spellcheck: true,

  element_format: "html",
  menubar: false,
  statusbar: false,
  toolbar: false,
  plugins: "autoresize,fullscreen,lists",
  autoresize_overflow_padding: 0,
  autoresize_bottom_margin: 0,
  max_height: 500,
  max_width: 500,
  skin: false,
  content_css: false,
  content_style: defaultContentStyle,
};

export const disabledContentStyle = `
  body {
    color: #747C87;
    background: #F3F4F5;
  }
`;

export const loadTinymce = async (): Promise<TinyMCE> => {
  if ((window as any).tinymce) {
    return (window as any).tinymce;
  } else {
    const { default: tinymce } = await import("@sapo/tinymce");
    return tinymce;
  }
};
