import React from "react";

export interface ImageProps extends React.HTMLProps<HTMLImageElement> {
  alt: string;
  source: string;
  onLoad?(): void;
  onError?(): void;
}

export function Image({ alt, source, onLoad, ...rest }: ImageProps) {
  return <img alt={alt} src={source} onLoad={onLoad} {...rest} />;
}
