import { isSameDay } from "date-fns";
import { sortBy } from "lodash-es";

import { EventResponse } from "app/types";

export function groupByDay(events: EventResponse[]) {
  const result: { day: Date; events: EventResponse[] }[] = [];
  const reversedEvents = sortBy(events, (event) => event.id).reverse();
  if (reversedEvents.length > 0) {
    for (const event of reversedEvents) {
      const keyDate = new Date(event.created_on);
      const eventGroup = result.find((ev) => isSameDay(ev.day, keyDate));
      if (eventGroup) {
        eventGroup.events.push(event);
      } else {
        result.push({ day: keyDate, events: [event] });
      }
    }
  }
  return result;
}
