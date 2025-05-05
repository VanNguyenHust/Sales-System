import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
import styled from "@emotion/styled";
import { ActionList, type ActionListItemDescriptor, Button, Popover, Stack } from "@/ui-components";

import { fakeI18n } from "../DateUtils";

interface YearSelectProps {
  month: number;
  year: number;
  onChangeDateFocus: React.Dispatch<
    React.SetStateAction<{
      month: number;
      year: number;
    }>
  >;
  minDate?: Date | null;
  maxDate?: Date | null;
}

const YearSelect = memo(function YearSelect({ minDate, maxDate, month, year, onChangeDateFocus }: YearSelectProps) {
  const handleChangeMonth = useCallback(
    (newMonth: { id: number; label: string }) => {
      onChangeDateFocus((prev) => ({
        ...prev,
        month: +newMonth.id,
        year: prev.year,
      }));
    },
    [onChangeDateFocus]
  );
  // goocs là không có deps thằng nào
  const handleChangeYear = useCallback(
    (newYear: { id: number; label: string }) => {
      onChangeDateFocus((prev) => {
        let month = prev.month;
        if (maxDate && maxDate.getFullYear() === year && month > maxDate.getMonth()) {
          month = maxDate.getMonth();
        }
        if (minDate && minDate.getFullYear() === year && month < minDate.getMonth()) {
          month = minDate.getMonth();
        }
        return {
          ...prev,
          month,
          year: +newYear.id,
        };
      });
    },
    [maxDate, minDate, onChangeDateFocus, year]
  );
  // goocs là không có deps thằng nào

  const months = useMemo(
    () =>
      [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
      ]
        .map((e, idx) => ({
          id: idx,
          label: fakeI18n(e),
        }))
        .filter((current) => {
          if (maxDate && maxDate.getFullYear() === year && current.id > maxDate.getMonth()) {
            return false;
          }
          return !(minDate && minDate.getFullYear() === year && current.id < minDate.getMonth());
        }),
    [minDate, maxDate, year]
  );

  const years = useMemo(() => {
    const _years = [];
    for (let i = 0; i < 400; i++) {
      const year = new Date().getFullYear() - 23 - 200 + i;
      if (minDate && minDate.getFullYear() > year) {
        continue;
      }
      if (maxDate && maxDate.getFullYear() < year) {
        break;
      }
      _years.push({
        id: year,
        label: year,
      });
    }
    return _years;
  }, [minDate, maxDate]);

  const [openSelectMonth, setOpenSelectMonth] = React.useState(false);
  const [openSelectYear, setOpenSelectYear] = React.useState(false);

  const listItemMonthRef = useRef<HTMLDivElement>(null);
  const listItemYearRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (openSelectYear && listItemYearRef.current) {
      const ulItem = listItemYearRef.current.querySelector("ul");
      const parent = listItemYearRef.current.parentElement?.parentElement;
      if (parent) parent.style.zIndex = "1000";
      if (ulItem) {
        listItemYearRef.current.scrollTop =
          (ulItem.children[years.findIndex((e) => e.id === year)] as any).offsetTop - 131;
      }
    }
  }, [openSelectYear, year, years]);

  useEffect(() => {
    if (openSelectMonth && listItemMonthRef.current) {
      const ulItem = listItemMonthRef.current.querySelector("ul");
      // hotfix để tạm
      const parent = listItemMonthRef.current.parentElement?.parentElement;
      if (parent) parent.style.zIndex = "1000";
      if (ulItem) {
        listItemMonthRef.current.scrollTop =
          (ulItem.children[months.findIndex((e) => e.id === month)] as any).offsetTop - 131;
      }
    }
  }, [openSelectMonth, month, months]);
  return (
    <StyledYearSelect>
      <Stack spacing="baseTight" alignment="center">
        <Popover
          active={openSelectMonth}
          activator={
            <Button
              onClick={() => {
                if (!openSelectMonth) setOpenSelectYear(false);
                setOpenSelectMonth(!openSelectMonth);
              }}
              disclosure={openSelectMonth ? "up" : "down"}
            >
              {months.filter((e) => e.id === month)?.[0].label}
            </Button>
          }
          onClose={() => {}}
          fixed
          preferInputActivator
          fullWidth
          fullHeight
        >
          <ActionListWrapper ref={listItemMonthRef}>
            <ActionList
              items={months.map((m) => {
                const result = {
                  id: `year-${m.id}`,
                  content: m.label,
                  onAction: () => {
                    handleChangeMonth({ id: m.id, label: m.label });
                    setOpenSelectMonth(false);
                  },
                } as ActionListItemDescriptor;
                if (m.id === month) {
                  result.active = true;
                }
                return result;
              })}
            />
          </ActionListWrapper>
        </Popover>
        <Popover
          active={openSelectYear}
          activator={
            <Button
              onClick={() => {
                if (!openSelectYear) setOpenSelectMonth(false);
                setOpenSelectYear(!openSelectYear);
              }}
              disclosure={openSelectYear ? "up" : "down"}
            >
              {`${year}`}
            </Button>
          }
          onClose={() => {}}
          fixed
          preferInputActivator
          fullWidth
          fullHeight
        >
          <ActionListWrapper ref={listItemYearRef}>
            <ActionList
              items={years.map((m) => {
                const result = {
                  content: `${m.label}`,
                  onAction: () => {
                    handleChangeYear({ id: m.id, label: `${m.label}` });
                    setOpenSelectYear(false);
                  },
                } as ActionListItemDescriptor;
                if (m.label === year) {
                  result.active = true;
                }
                return result;
              })}
            />
          </ActionListWrapper>
        </Popover>
      </Stack>
    </StyledYearSelect>
  );
});

const StyledYearSelect = styled.div`
  padding-top: ${(p) => p.theme.spacing(3)};
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
export default YearSelect;
