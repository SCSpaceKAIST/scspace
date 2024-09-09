import { EventInput } from "@fullcalendar/core";
import { ReservationContentTypeEnum, ReservationType } from "../reservation";

export interface CalendarEventInput extends EventInput {
  extendedProps: {
    contents: ReservationContentTypeEnum;
  };
}

export type CalendarOutputType = ReservationType[] | false;
