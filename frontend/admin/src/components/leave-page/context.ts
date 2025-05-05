import React from "react";
import { type Blocker } from "react-router-dom";

type LeavePageContextType = {
  setBlocker(blocker?: Blocker): void;
};

export const LeavePageContext = React.createContext<LeavePageContextType | undefined>(undefined);
