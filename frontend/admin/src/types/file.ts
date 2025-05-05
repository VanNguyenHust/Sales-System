export type MediaFileResponse = {
  id: number;
  src: string;
  alt: string | null;
  extension: string | null;
  name: string | null;
  content_type: string | null;
  created_on: string;
  modified_on: string | null;
  size: number;
  width: string | null;
  height: string | null;
};
