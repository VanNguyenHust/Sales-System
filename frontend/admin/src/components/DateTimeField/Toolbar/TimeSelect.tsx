import React, { useEffect, useMemo, useRef } from "react";
import styled from "@emotion/styled";
import { Button } from "@/ui-components";
import {
  addMinutes,
  closestTo,
  differenceInDays,
  format,
  parse,
  setHours,
  setMinutes,
  setSeconds,
  toDate,
} from "date-fns";

interface TimeSelectProps {
  value: Date | null | undefined;
  onChange: (hour: number, minute: number) => void;
  periodTime?: 15 | 30;
  getTempTime?: (hour: number, minute: number) => void;
}

export const TimeSelect = ({ value, onChange, periodTime = 30, getTempTime }: TimeSelectProps) => {
  const options = useMemo(() => {
    const count = 24 * (60 / periodTime);
    const firstTime = setMinutes(setHours(setSeconds(new Date(), 0), 0), 0);
    let current = new Date(toDate(firstTime));
    const items = [];
    let i = 0;
    while (i < count && differenceInDays(firstTime, current) === 0) {
      items.push(format(current, "HH:mm"));
      current = addMinutes(current, periodTime);
      i++;
    }
    return items;
  }, [periodTime]);
  const closestToStartTimeSelected = value
    ? parse(`${value.getHours()}:${value.getMinutes()}`, "HH:mm", new Date())
    : new Date();
  const closestStartTime = closestTo(
    closestToStartTimeSelected,
    options.map((o) => parse(o, "HH:mm", new Date()))
  );

  const valueFormat = closestStartTime ? format(closestStartTime, "HH:mm") : "10:00";
  const refUpdateSelectedTime = useRef(false);
  useEffect(() => {
    if (refUpdateSelectedTime.current) {
      return;
    }
    refUpdateSelectedTime.current = true;
    closestStartTime && getTempTime && getTempTime(closestStartTime.getHours(), closestStartTime.getMinutes());
  }, [closestStartTime, getTempTime]);

  const listItemRef = useRef<HTMLUListElement>(null);
  const refInitScrollToValue = useRef(false);
  useEffect(() => {
    if (!refInitScrollToValue.current && listItemRef.current) {
      const refValueFocus = value ? value : closestStartTime;
      listItemRef.current.scrollTop =
        (listItemRef.current.children[options.findIndex((e) => e === format(refValueFocus as Date, "HH:mm"))] as any)
          ?.offsetTop - 131;
      refInitScrollToValue.current = true;
    }
  }, [closestStartTime, options, value, valueFormat]);
  return (
    <StyledTimeSelect ref={listItemRef}>
      {options.map((o) => {
        return (
          <StyledLineItem key={o}>
            <Button
              primary={!value ? false : valueFormat === o}
              onClick={() => {
                const time = parse(o, "HH:mm", new Date());
                onChange(time.getHours(), time.getMinutes());
              }}
            >
              {o}
            </Button>
          </StyledLineItem>
        );
      })}
    </StyledTimeSelect>
  );
};

const StyledTimeSelect = styled.ul`
  max-height: 262px;
  overflow: hidden auto;
  list-style-type: none;
  margin: 0;
  outline: none;
  padding: 0;
  scrollbar-width: thin;
  &::-webkit-scrollbar {
    width: ${(p) => p.theme.spacing(2)};
  }
  &::-webkit-scrollbar-track {
    background: ${(p) => p.theme.components.scrollBar.scrollBarTrackColor};
  }
  &::-webkit-scrollbar-thumb {
    background: ${(p) => p.theme.components.scrollBar.scrollBarThumbColor};
    border-radius: ${(p) => p.theme.shape.borderRadius(1)};
    &:hover {
      background: ${(p) => p.theme.components.scrollBar.scrollBarThumbHoverColor};
    }
  }
`;
const StyledLineItem = styled.li`
  padding: ${(p) => p.theme.spacing(1)} ${(p) => p.theme.spacing(2)};
`;
