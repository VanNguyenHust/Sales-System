import React, { createContext, useContext } from "react";

type TimelineItemContextType = boolean;
export const TimelineItemContext = createContext<TimelineItemContextType>(false);
