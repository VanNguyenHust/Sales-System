export const getBase64 = (file: File) => {
  return new Promise((resolve: (value: string) => void) => {
    let baseURL: string;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      baseURL = reader.result?.toString() || "";
      resolve(baseURL.split(",")[1]);
    };
  });
};

export const getBase64FromBlob = async (blob: Blob) => {
  return new Promise((resolve: (value: string) => void, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64String = reader.result?.toString().split(",")[1] || "";
      resolve(base64String);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

export const getBase64Raw = (file: File) => {
  return new Promise((resolve: (value: string | ArrayBuffer) => void, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (!reader.result) {
        reject();
      } else {
        resolve(reader.result);
      }
    };
  });
};

export const ImportExcelAcceptType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel";

export const AcceptImageFileTypes = [
  "image/jpeg",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/bmp",
  "image/raw",
  "image/arw",
  "image/nef",
  "image/tiff",
  "image/tiff",
];

export function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    const kbSize = (size / 1024).toFixed(2);
    return `${kbSize} KB`;
  } else {
    const mbSize = (size / (1024 * 1024)).toFixed(2);
    return `${mbSize} MB`;
  }
}

/** Get file extension with dot prefix */
export function getFileExtenion(filename: string) {
  return filename.substring(filename.lastIndexOf("."));
}
