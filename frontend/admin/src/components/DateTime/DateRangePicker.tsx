import React, { useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button } from "@/ui-components";
import { chunk } from "lodash-es";

import { DateRangeValue, RelativeDateValue } from "app/types";
import { relativeDateOptions } from "app/utils/datetime";

import { DateField, DateFieldProps } from "./DateField";

export interface DateRangePickerProps
  extends Pick<DateFieldProps, "monthYearSelection" | "disableDatesAfter" | "disableDatesBefore" | "format"> {
  value?: DateRangeValue | null;
  onChange(value?: DateRangeValue | null): void;
}

export const DateRangePicker = ({ value, onChange, ...dateFieldProps }: DateRangePickerProps) => {
  const [expaned, setExpanded] = useState(!!(value && !value?.relative));
  const handleCustomClick = () => {
    setExpanded((prev) => !prev);
    onChange(null);
  };

  const selectRelative = (value: RelativeDateValue) => () => {
    setExpanded(false);
    onChange({ start: undefined, end: undefined, relative: value });
  };

  return (
    <StyledGroups>
      {chunk(relativeDateOptions, 2).map((group) => {
        const [item1, item2] = group;
        const selectedItem1 = item1.value === value?.relative;
        const selectedItem2 = item2?.value === value?.relative;
        return (
          <StyledGroup key={item1.value}>
            <StyledItems>
              <StyledItem button>
                <Button outline={selectedItem1} primary={selectedItem1} fullWidth onClick={selectRelative(item1.value)}>
                  {item1.label}
                </Button>
              </StyledItem>
              {item2 ? (
                <StyledItem button>
                  <Button
                    outline={selectedItem2}
                    primary={selectedItem2}
                    fullWidth
                    onClick={selectRelative(item2.value)}
                  >
                    {item2.label}
                  </Button>
                </StyledItem>
              ) : (
                <StyledItem />
              )}
            </StyledItems>
          </StyledGroup>
        );
      })}
      <StyledGroup>
        <StyledItems>
          <StyledItem button>
            <Button outline={expaned} primary={expaned} fullWidth onClick={handleCustomClick}>
              Tùy chọn
            </Button>
          </StyledItem>
        </StyledItems>
      </StyledGroup>
      {expaned && (
        <StyledGroup>
          <StyledItems>
            <StyledItem>
              <DateField
                {...dateFieldProps}
                value={value?.start}
                onChange={(v) => onChange({ ...value, relative: undefined, start: v })}
              />
            </StyledItem>
            <StyledItem>
              <DateField
                {...dateFieldProps}
                value={value?.end}
                onChange={(v) => onChange({ ...value, relative: undefined, end: v })}
              />
            </StyledItem>
          </StyledItems>
        </StyledGroup>
      )}
    </StyledGroups>
  );
};

const StyledItem = styled.div<{
  button?: boolean;
}>`
  flex: 1 1 7rem;
  ${(p) =>
    p.button &&
    css`
      button {
        span {
          font-weight: ${p.theme.typography.fontWeightRegular};
        }
      }
    `}
`;

const StyledItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(p) => p.theme.spacing(2)};
`;

const StyledGroup = styled.div``;

const StyledGroups = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing(2)};
`;
