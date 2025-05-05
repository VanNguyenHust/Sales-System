import React from "react";
import DOMPurify from "dompurify";

export const PrintUtilsConfigurator = () => {
  return (
    <iframe title="printIframe" id="printIframe" style={{ position: "absolute", width: 0, height: 0, border: 0 }} />
  );
};
export const PrintUtilsConfiguratorSpx = () => {
  return (
    <iframe
      title="printIframeSpx"
      id="printIframeSpx"
      style={{ position: "absolute", width: 0, height: 0, border: 0 }}
    />
  );
};

const PrintUtils = {
  print(htmlContent: string, onPrinted?: (_document: Window) => Promise<Window>) {
    const contentWindow = (document.getElementById("printIframe") as HTMLIFrameElement).contentWindow;
    let resolve: any;
    const resultPromise = new Promise((_resolve) => {
      resolve = _resolve;
    });
    if (contentWindow) {
      contentWindow.document.body.innerHTML = DOMPurify.sanitize(htmlContent);
      const print = (_contentWindow: Window) => {
        _contentWindow.addEventListener("afterprint", (e) => resolve(e), {
          once: true,
        });
        _contentWindow.focus();
        setTimeout(() => {
          _contentWindow.print();
          (document?.activeElement as any)?.blur?.();
        }, 50);
      };
      if (onPrinted) {
        onPrinted(contentWindow)
          .then((__window) => {
            print(__window);
          })
          .catch((_) => {});
      } else {
        print(contentWindow);
      }
    }
    return resultPromise;
  },
};

export const PrintUtilsPDF = {
  async print(pdfBase64: string) {
    const blob = base64ToBlob(pdfBase64, "application/pdf");
    const url = URL.createObjectURL(blob);
    const contentWindow = (document.getElementById("printIframeSpx") as HTMLIFrameElement).contentWindow;
    let resolve: any;
    const resultPromise = new Promise((_resolve) => {
      resolve = _resolve;
    });
    if (contentWindow) {
      (document.getElementById("printIframeSpx") as HTMLIFrameElement).setAttribute("src", url);
      contentWindow.addEventListener("afterprint", (e) => resolve(e), {
        once: true,
      });
      contentWindow.focus();
      setTimeout(() => {
        contentWindow.print();
        (document?.activeElement as any)?.blur?.();
      }, 50);
    }
    return resultPromise;
  },
};

function base64ToBlob(base64: string, type = "application/octet-stream") {
  const binStr = atob(base64);
  const len = binStr.length;
  const arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    arr[i] = binStr.charCodeAt(i);
  }
  return new Blob([arr], { type });
}

export default PrintUtils;
