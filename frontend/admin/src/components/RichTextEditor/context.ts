import React, { useContext } from "react";

export const FullscreenContext = React.createContext(false);

export const useFullscreen = () => {
  return useContext(FullscreenContext);
};
