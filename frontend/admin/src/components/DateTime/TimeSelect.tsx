import styled from "@emotion/styled";
import { Button, Scrollable, Stack } from "@/ui-components";

type Props = {
  value: string;
  onChange(value: string): void;
};

const timeRanges = genTimeRanges();

export function TimeSelect({ value, onChange }: Props) {
  return (
    <Scrollable style={{ maxHeight: 300, paddingLeft: 4, paddingRight: 4, width: 100 }} horizontal={false}>
      <StyledList>
        {timeRanges.map((item) => (
          <Button key={item} outline={value === item} primary={value === item} onClick={() => onChange(item)}>
            {item}
          </Button>
        ))}
      </StyledList>
    </Scrollable>
  );
}

const StyledList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing(2)};
`;

function genTimeRanges() {
  const result: string[] = ["00:00"];
  let step = 0;
  let prevSecond = 0;
  do {
    const convertStep = String(step).padStart(2, "0");
    if (prevSecond === 0) {
      result.push(`${convertStep}:30`);
      prevSecond = 30;
      step++;
    } else {
      result.push(`${convertStep}:00`);
      prevSecond = 0;
    }
  } while (step <= 23);
  return result;
}
