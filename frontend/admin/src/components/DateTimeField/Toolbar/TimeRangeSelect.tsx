import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import { ActionList, type ActionListItemDescriptor, Button, Popover, Stack } from "@/ui-components";
import {
  addMinutes,
  closestTo,
  differenceInDays,
  format,
  isAfter,
  isBefore,
  parse,
  setHours,
  setMinutes,
  setSeconds,
  toDate,
} from "date-fns";
import { isNil } from "lodash-es";

import { useToggle } from "app/utils/useToggle";

interface TimeRangeSelectProps {
  startTime?: {
    hour: number;
    minute: number;
  } | null;
  endTime?:
    | {
        hour: number;
        minute: number;
      }
    | null
    | undefined;
  onChangeStartTime: (hour: number, minute: number) => void;
  onChangeEndTime: (hour: number, minute: number) => void;
  periodTime?: 15 | 30;
  getSelectedTimeRange?: (
    startTime: {
      hour: number;
      minute: number;
    },
    endTime: {
      hour: number;
      minute: number;
    }
  ) => void;
}

export const TimeRangeSelect = ({
  startTime,
  endTime,
  onChangeStartTime,
  onChangeEndTime,
  periodTime = 30,
  getSelectedTimeRange,
}: TimeRangeSelectProps) => {
  const [tempStartTime, setTempStartTime] = useState(
    setMinutes(setHours(new Date(), startTime ? startTime.hour : 0), startTime ? startTime.minute : 0)
  );
  const [tempEndTime, setTempEndTime] = useState(
    setMinutes(setHours(new Date(), endTime ? endTime.hour : 23), endTime ? endTime.minute : 59)
  );

  const refStartTime = useRef(startTime);
  useEffect(() => {
    if (refStartTime.current === startTime) {
      return;
    }
    refStartTime.current = startTime;
    if (startTime?.hour !== tempStartTime.getHours() || startTime?.minute !== tempStartTime.getMinutes()) {
      setTempStartTime(
        setMinutes(setHours(new Date(), startTime ? startTime.hour : 0), startTime ? startTime.minute : 0)
      );
    }
  }, [startTime, tempStartTime]);

  const refEndTime = useRef(endTime);

  useEffect(() => {
    if (refEndTime.current === endTime) {
      return;
    }
    refEndTime.current = endTime;
    if (endTime?.hour !== tempEndTime.getHours() || endTime?.minute !== tempEndTime.getMinutes()) {
      setTempEndTime(setMinutes(setHours(new Date(), endTime ? endTime.hour : 23), endTime ? endTime.minute : 59));
    }
  }, [endTime, tempEndTime]);

  const options = useMemo(() => {
    const firstTime = setSeconds(setMinutes(setHours(new Date(), 0), 0), 0);
    let current = new Date(toDate(firstTime));
    const items = [];
    let i = 0;
    while (i < 24 * (60 / periodTime) && differenceInDays(current, firstTime) === 0) {
      items.push({
        id: format(current, "HH:mm"),
        label: format(current, "HH:mm"),
      });
      current = addMinutes(current, periodTime);
      i++;
    }
    return items;
  }, [periodTime]);

  const handleChangeStartTime = useCallback(
    (selected: { id: string }) => {
      const momentSelected = parse(selected.id, "HH:mm", new Date());
      if (isNil(startTime)) {
        if (tempEndTime && isAfter(momentSelected, tempEndTime)) {
          setTempEndTime(parse(selected.id, "HH:mm", new Date()));
          setTempStartTime(tempEndTime);
        } else setTempStartTime(parse(selected.id, "HH:mm", new Date()));
        return;
      }
      const end = endTime ? parse(`${endTime.hour}:${endTime.minute}`, "HH:mm", new Date()) : null;
      if (end && isAfter(momentSelected, end)) {
        onChangeStartTime(end.getHours(), end.getMinutes());
        onChangeEndTime(momentSelected.getHours(), momentSelected.getMinutes());
      } else onChangeStartTime(momentSelected.getHours(), momentSelected.getMinutes());
    },
    [tempEndTime, startTime, endTime, onChangeStartTime, onChangeEndTime]
  );

  const handleChangeEndTime = useCallback(
    (selected: { id: string }) => {
      const momentSelected = parse(selected.id, "HH:mm", new Date());
      if (isNil(endTime)) {
        if (tempStartTime && isBefore(momentSelected, tempStartTime)) {
          setTempStartTime(parse(selected.id, "HH:mm", new Date()));
          setTempEndTime(tempStartTime);
        } else setTempEndTime(parse(selected.id, "HH:mm", new Date()));
        return;
      }
      const start = startTime ? parse(`${startTime.hour}:${startTime.minute}`, "HH:mm", new Date()) : null;
      if (start && isBefore(momentSelected, start)) {
        onChangeEndTime(start.getHours(), start.getMinutes());
        onChangeStartTime(momentSelected.getHours(), momentSelected.getMinutes());
      } else onChangeEndTime(momentSelected.getHours(), momentSelected.getMinutes());
    },
    [tempStartTime, startTime, endTime, onChangeStartTime, onChangeEndTime]
  );

  const {
    value: openStartTimeSelect,
    toggle: toggleStartTimeSelect,
    setFalse: closeStartTimeSelect,
  } = useToggle(false);
  const { value: openEndTimeSelect, toggle: toggleEndTimeSelect, setFalse: closeEndTimeSelect } = useToggle(false);

  const listItemStartTimeSelectRef = useRef<HTMLDivElement>(null);
  const listItemEndTimeSelectRef = useRef<HTMLDivElement>(null);

  const closestToStartTimeSelected = startTime
    ? parse(`${startTime.hour}:${startTime.minute}`, "HH:mm", new Date())
    : tempStartTime;
  const closestStartTime = closestTo(
    closestToStartTimeSelected,
    options.map((time) => parse(time.id, "HH:mm", new Date()))
  );
  const idStartTimeSelected = closestStartTime ? format(closestStartTime, "HH:mm") : options[0].id;

  const startTimeSelectSelected = options.filter((e) => e.id === idStartTimeSelected);
  const closestToEndTimeSelected = endTime
    ? parse(`${endTime.hour}:${endTime.minute}`, "HH:mm", new Date())
    : tempEndTime;
  const closestEndTime = closestTo(
    closestToEndTimeSelected,
    options.map((time) => parse(time.id, "HH:mm", new Date()))
  );
  const refUpdateSelectedTimeRange = useRef(false);
  useEffect(() => {
    if (refUpdateSelectedTimeRange.current) {
      return;
    }
    refUpdateSelectedTimeRange.current = true;
    getSelectedTimeRange &&
      closestEndTime &&
      closestStartTime &&
      getSelectedTimeRange(
        {
          hour: closestStartTime.getHours(),
          minute: closestStartTime.getMinutes(),
        },
        {
          hour: closestEndTime.getHours(),
          minute: closestEndTime.getMinutes(),
        }
      );
  }, [tempStartTime, tempEndTime, getSelectedTimeRange, closestEndTime, closestStartTime]);
  const idEndTimeSelected = closestEndTime ? format(closestEndTime, "HH:mm") : options[options.length - 1].id;
  const endTimeSelectSelected = options.filter((e) => e.id === idEndTimeSelected);

  useEffect(() => {
    if (openStartTimeSelect && listItemStartTimeSelectRef.current) {
      const ulItem = listItemStartTimeSelectRef.current.querySelector("ul");

      if (ulItem) {
        listItemStartTimeSelectRef.current.scrollTop =
          (ulItem.children[options.findIndex((e) => e.id === startTimeSelectSelected[0]?.id)] as any).offsetTop - 131;
      }
    }
  }, [openStartTimeSelect, options, startTimeSelectSelected]);

  useEffect(() => {
    if (openEndTimeSelect && listItemEndTimeSelectRef.current) {
      const ulItem = listItemEndTimeSelectRef.current.querySelector("ul");

      if (ulItem) {
        listItemEndTimeSelectRef.current.scrollTop =
          (ulItem.children[options.findIndex((e) => e.id === endTimeSelectSelected[0]?.id)] as any).offsetTop - 131;
      }
    }
  }, [openEndTimeSelect, options, endTimeSelectSelected]);
  return (
    <StyledTimeRangeSelect>
      <Stack spacing="baseTight" alignment="center">
        <Popover
          active={openStartTimeSelect}
          activator={
            <Button
              onClick={() => {
                if (!openStartTimeSelect) closeEndTimeSelect();
                toggleStartTimeSelect();
              }}
              disclosure={openStartTimeSelect ? "up" : "down"}
            >
              {startTimeSelectSelected?.[0]?.label}
            </Button>
          }
          onClose={closeStartTimeSelect}
          fixed
          preferInputActivator
          fullWidth
          fullHeight
        >
          <ActionListWrapper ref={listItemStartTimeSelectRef}>
            <ActionList
              items={options.map((m) => {
                const result = {
                  id: `StartTime-${m.id}`,
                  content: m.label,
                  onAction: () => {
                    handleChangeStartTime({ id: m.id });
                    closeStartTimeSelect();
                  },
                } as ActionListItemDescriptor;
                result.active = m.id === startTimeSelectSelected?.[0]?.id;
                return result;
              })}
            />
          </ActionListWrapper>
        </Popover>
        <Popover
          active={openEndTimeSelect}
          activator={
            <Button
              onClick={() => {
                if (!openEndTimeSelect) closeStartTimeSelect();
                toggleEndTimeSelect();
              }}
              disclosure={openEndTimeSelect ? "up" : "down"}
            >
              {endTimeSelectSelected?.[0]?.label}
            </Button>
          }
          onClose={closeStartTimeSelect}
          fixed
          preferInputActivator
          fullWidth
          fullHeight
        >
          <ActionListWrapper ref={listItemEndTimeSelectRef}>
            <ActionList
              items={options.map((m) => {
                const result = {
                  id: `EndTime-${m.id}`,
                  content: m.label,
                  onAction: () => {
                    handleChangeEndTime({ id: m.id });
                    closeEndTimeSelect();
                  },
                } as ActionListItemDescriptor;
                result.active = m.id === endTimeSelectSelected?.[0]?.id;
                return result;
              })}
            />
          </ActionListWrapper>
        </Popover>
      </Stack>
    </StyledTimeRangeSelect>
  );
};
const StyledTimeRangeSelect = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ActionListWrapper = styled.div`
  max-height: 262px;
  overflow: hidden auto;
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
