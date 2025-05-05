import { useEffect, useState } from "react";

import {
  BreakpointsDirection,
  BreakpointsKey,
  BreakpointsValues,
  breakpointsValues,
} from "../themes/createBreakpoints";

/**
 * Directional alias for each UI `breakpoints` token.
 *
 * @example 'smUp' | 'smDown' | 'smOnly' | 'mdUp' | etc.
 */
export type BreakpointsDirectionAlias = `${BreakpointsKey}${Capitalize<BreakpointsDirection>}`;

type BreakpointsMatches = {
  [DirectionAlias in BreakpointsDirectionAlias]: boolean;
};

const breakpointsQueryEntries = getBreakpointsQueryEntries(breakpointsValues);

/**
 * Retrieves media query matches for each directional UI `breakpoints` alias.
 *
 * @example
 * const {smUp} = useBreakpoints();
 * return smUp && 'Hello world';
 */
export function useBreakpoints() {
  const [breakpoints, setBreakpoints] = useState(getMatches());

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mediaQueryLists = breakpointsQueryEntries.map(([_, query]) => window.matchMedia(query));

    const handler = () => setBreakpoints(getMatches());

    mediaQueryLists.forEach((mql) => {
      mql.addEventListener("change", handler);
    });

    return () =>
      mediaQueryLists.forEach((mql) => {
        mql.removeEventListener("change", handler);
      });
  }, []);

  return breakpoints;
}

function getMatches() {
  return Object.fromEntries(
    breakpointsQueryEntries.map(([directionAlias, query]) => [directionAlias, window.matchMedia(query).matches])
  ) as BreakpointsMatches;
}

/**
 * Converts `breakpoints` tokens into directional media query entries.
 *
 * @example
 * const breakpointsQueryEntries = getBreakpointsQueryEntries(breakpoints);
 * breakpointsQueryEntries === [
 *   ['xsUp', '(min-width: ...)'],
 *   ['xsDown', '(max-width: ...)'],
 *   ['xsOnly', '(min-width: ...) and (max-width: ...)'],
 *   ['smUp', '(min-width: ...) and (max-width: ...)'],
 *   ['mdUp', '(min-width: ...) and (max-width: ...)'],
 *   // etc.
 * ]
 */
function getBreakpointsQueryEntries(breakpoints: BreakpointsValues) {
  const mediaConditionEntries: [BreakpointsDirectionAlias, string][] = [];
  breakpoints.keys.forEach((key) => {
    breakpoints.directions.forEach((direction) => {
      const directionAlias = `${key}${capitalize(direction)}` as BreakpointsDirectionAlias;
      mediaConditionEntries.push([directionAlias, breakpoints.tokenGroups[direction](key)]);
    });
  });
  return mediaConditionEntries;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
