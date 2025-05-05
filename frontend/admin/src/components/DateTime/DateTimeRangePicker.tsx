import { useMemo, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button } from "@/ui-components";
import { startOfMinute } from "date-fns";
import { chunk } from "lodash-es";

import { DateRangeValue, RelativeDateValue } from "app/types";
import {
  DATE_TIME_FORMAT,
  DATE_TIME_UTC_FORMAT,
  formatDate,
  parseDate,
  relativeDateOptions,
  useDatetime,
} from "app/utils/datetime";

import { DateTimeSelect } from "./DateTimeSelect";

export interface DateTimeRangePickerProps {
  value?: DateRangeValue | null;
  onChange(value?: DateRangeValue | null): void;
}

export const DateTimeRangePicker = ({ value, onChange, ...datePickerProps }: DateTimeRangePickerProps) => {
  const { inUTC } = useDatetime();
  const [expanded, setExpanded] = useState(!!(value && !value?.relative));

  const selectRelative = (value: RelativeDateValue) => () => {
    setExpanded(false);
    onChange({ start: undefined, end: undefined, relative: value });
  };

  const handleCustomClick = () => {
    setExpanded((prev) => !prev);
    onChange(null);
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
            <Button outline={expanded} primary={expanded} fullWidth onClick={handleCustomClick}>
              Tùy chọn
            </Button>
          </StyledItem>
        </StyledItems>
      </StyledGroup>
      {expanded && (
        <StyledGroup>
          <StyledItems>
            <StyledItem>
              <DateTimeSelect
                activator={
                  <DateTimeSelect.DateField
                    format={DATE_TIME_FORMAT}
                    placeholder={DATE_TIME_FORMAT}
                    {...datePickerProps}
                  />
                }
                value={
                  value?.start
                    ? formatDate(startOfMinute(value.start), DATE_TIME_UTC_FORMAT, {
                        in: inUTC,
                      })
                    : ""
                }
                onChange={(v) =>
                  onChange({
                    ...value,
                    relative: undefined,
                    start: parseDate(formatDate(startOfMinute(v), DATE_TIME_UTC_FORMAT), DATE_TIME_UTC_FORMAT),
                  })
                }
              />
            </StyledItem>
            <StyledItem>
              <DateTimeSelect
                activator={
                  <DateTimeSelect.DateField
                    format={DATE_TIME_FORMAT}
                    placeholder={DATE_TIME_FORMAT}
                    {...datePickerProps}
                  />
                }
                value={
                  value?.end
                    ? formatDate(startOfMinute(value.end), DATE_TIME_UTC_FORMAT, {
                        in: inUTC,
                      })
                    : ""
                }
                onChange={(v) =>
                  onChange({
                    ...value,
                    relative: undefined,
                    end: parseDate(formatDate(startOfMinute(v), DATE_TIME_UTC_FORMAT), DATE_TIME_UTC_FORMAT),
                  })
                }
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
