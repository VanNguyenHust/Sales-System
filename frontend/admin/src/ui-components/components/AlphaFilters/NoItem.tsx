import React from "react";

export interface NoItemProps {
  children: React.ReactNode;
}

export function NoItem({ children }: NoItemProps) {
  return children;
}
