import React, { memo, useCallback, useMemo } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button, Text } from "@/ui-components";
import { ArrowChevronBigLeftIcon, ArrowChevronBigRightIcon } from "@/ui-icons";
import { add, set, sub } from "date-fns";

import { fakeI18n } from "../DateUtils";

interface MonthPrevNextProps {
  month: number;
  year: number;
  onChangeDateFocus: React.Dispatch<
    React.SetStateAction<{
      month: number;
      year: number;
    }>
  >;
  hiddenNext?: boolean;
  hiddenPrev?: boolean;
}

const MonthPrevNext = memo(function MonthPrevNext(props: MonthPrevNextProps) {
  const { month, year, onChangeDateFocus, hiddenNext, hiddenPrev } = props;
  const handlePrev = useCallback(() => {
    onChangeDateFocus((prev) => {
      const newMonth = sub(set(new Date(), { year: prev.year, month: prev.month }), { months: 1 });
      return {
        year: newMonth.getFullYear(),
        month: newMonth.getMonth(),
      };
    });
  }, [onChangeDateFocus]);

  const handleNext = useCallback(() => {
    onChangeDateFocus((prev) => {
      const newMonth = add(set(new Date(), { year: prev.year, month: prev.month }), { months: 1 });
      return {
        year: newMonth.getFullYear(),
        month: newMonth.getMonth(),
      };
    });
  }, [onChangeDateFocus]);

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
      ].map((e, idx) => ({
        id: idx,
        label: fakeI18n(e),
      })),
    []
  );

  return (
    <StyledMonthPrevNext>
      <StyledIconButtonWrap hidden={hiddenPrev}>
        <Button plain onClick={handlePrev} icon={ArrowChevronBigLeftIcon} />
      </StyledIconButtonWrap>
      <div>
        <Text as="h6" variant="bodyXs">
          <span style={{ fontWeight: 500 }}>{months.filter((e) => e.id === month)?.[0]?.label}</span>&nbsp;
          <span>{year}</span>
        </Text>
      </div>
      <StyledIconButtonWrap hidden={hiddenNext}>
        <Button plain onClick={handleNext} icon={ArrowChevronBigRightIcon} />
      </StyledIconButtonWrap>
    </StyledMonthPrevNext>
  );
});

const StyledIconButtonWrap = styled.div<{ hidden?: boolean }>`
  ${(p) =>
    p.hidden &&
    css`
      & > button {
        opacity: 0;
        visibility: visible;
        pointer-events: none;
      }
    `}
`;

const StyledMonthPrevNext = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 ${(p) => p.theme.spacing(4)};
  height: ${(p) => p.theme.spacing(12)};
`;

export default MonthPrevNext;
