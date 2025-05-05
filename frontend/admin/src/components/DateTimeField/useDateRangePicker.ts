import { useCallback } from "react";
import { isBefore } from "date-fns";

const useDateRangePicker = () => {
  return useCallback((date: Date, firstValue: Date | null | undefined, secondValue: Date | null | undefined) => {
    if (!firstValue) {
      return {
        firstValue: date,
        secondValue: null,
      };
    }
    if (!secondValue) {
      if (isBefore(date, firstValue)) {
        return {
          firstValue: date,
          secondValue,
        };
      } else {
        return {
          firstValue,
          secondValue: date,
        };
      }
    }
    return {
      firstValue: date,
      secondValue: null,
    };
  }, []);
};

export default useDateRangePicker;
