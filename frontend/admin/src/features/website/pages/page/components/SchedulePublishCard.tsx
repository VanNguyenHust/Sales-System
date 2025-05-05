import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { Button, Card, ChoiceList, Stack } from "@/ui-components";
import { CloseBigIcon } from "@/ui-icons";
import { addMinutes, startOfHour } from "date-fns";

import DateTimeField from "app/components/DateTimeField/DateTimeField";
import { ChoiceItemDescriptor } from "app/types";

type Props = {
  currentValue: string | null;
  value: string | null;
  onChange(value: string | null): void;
};

const options: ChoiceItemDescriptor[] = [
  {
    label: "Hiện",
    value: "true",
  },
  {
    label: "Ẩn",
    value: "false",
  },
];

export function SchedulePublishCard({ currentValue, value, onChange }: Props) {
  const [now, setNow] = useState(new Date());

  const refreshNow = () => {
    const now = new Date();
    setNow(now);
    return now;
  };

  const isHidden = useMemo(() => {
    if (!value) {
      return true;
    }
    return new Date(value) > now;
  }, [value, now]);

  const isScheduled = isHidden && !!value;

  return (
    <Card title="Trạng thái" sectioned>
      <Stack vertical spacing="extraTight">
        <ChoiceList
          choices={options}
          selected={[isHidden ? "false" : "true"]}
          onChange={(values) => {
            const now = refreshNow();
            if (values[0] === "false") {
              onChange(null);
            } else {
              if (currentValue && new Date(currentValue) < now) {
                // current value already published
                onChange(currentValue);
              } else {
                onChange(formatDateApi(now));
              }
            }
          }}
        />
        {!isScheduled ? (
          <Button
            plain
            onClick={() => {
              const now = refreshNow();
              const startHour = startOfHour(now);
              const middleHour = addMinutes(startHour, 30);
              const nextHour = addMinutes(middleHour, 30);
              onChange(formatDateApi(now < middleHour ? middleHour : nextHour));
            }}
          >
            Đặt lịch hiển thị
          </Button>
        ) : (
          <StyledPublishedField>
            <DateTimeField
              label="Thời gian hiển thị"
              value={value ? new Date(value) : undefined}
              placeholder="dd/MM/yyyy - HH:mm"
              periodTime={30}
              variant="timePicker"
              onChange={(date) => {
                if (date && date > refreshNow()) {
                  onChange(formatDateApi(date));
                }
              }}
            />
            <Button plain onClick={() => onChange(null)} icon={CloseBigIcon} />
          </StyledPublishedField>
        )}
      </Stack>
    </Card>
  );
}

// See: https://stackoverflow.com/questions/34053715/how-to-output-date-in-javascript-in-iso-8601-without-milliseconds-and-with-z
function formatDateApi(date: Date) {
  return `${date.toISOString().split(".")[0]}Z`;
}

const StyledPublishedField = styled.div`
  display: flex;
  align-items: flex-end;
  & > div {
    width: 100%;
  }
  button {
    margin: 0;
  }
`;
