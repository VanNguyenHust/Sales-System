export interface FileFilterRequest {
  id?: number[];
  query?: string;
  size_max?: number;
  size_min?: number;
  type?: string;
  image?: boolean;
  page?: number;
  limit?: number;
}

export type File = {
  id: number;
  src: string;
  extension: string | null;
  name: string;
  content_type: string | null;
  created_on: string;
  modified_on: string | null;
  size: number;
  width: number | null;
  height: number | null;
  image: boolean;
};

export type MediaFileList = {
  files: File[];
};

export type FilesResponse = {
  files: File[];
};

export type FileRequest = {
  id?: number;
  base64?: string;
  src?: string;
  filename?: string;
  size?: number;
  alt?: string;
};

export type UploadFiles = {
  images: FileRequest[];
};
