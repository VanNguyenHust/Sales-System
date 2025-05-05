import { useEffect, useRef } from "react";

type Props = {
  onScan: (barcode: string) => void;
};

export const useScanBarcode = ({ onScan }: Props) => {
  const allowScanBarcode = useRef(true);

  useEffect(() => {
    let dataScanTemp = "";
    let timeout: NodeJS.Timeout | undefined;
    const handleBarcodeKeyEvent = (event: KeyboardEvent) => {
      if (timeout) clearTimeout(timeout);

      const activeElement = document.activeElement;
      if (
        activeElement !== null &&
        activeElement.localName.toString() !== "input" &&
        activeElement.localName.toString() !== "textarea"
      ) {
        if (event.key === "Enter") {
          if (dataScanTemp !== "") {
            if (allowScanBarcode.current) onScan(dataScanTemp);
            dataScanTemp = "";
          }
        } else {
          dataScanTemp += event.key;
          timeout = setTimeout(() => {
            dataScanTemp = "";
          }, 500);
        }
      }
    };
    document.addEventListener("keypress", handleBarcodeKeyEvent);
    return () => {
      document.removeEventListener("keypress", handleBarcodeKeyEvent);
    };
  }, [onScan]);

  const disableScanBarcode = () => {
    allowScanBarcode.current = false;
  };

  const enableScanBarcode = () => {
    allowScanBarcode.current = true;
  };

  return {
    disableScanBarcode,
    enableScanBarcode,
  };
};
