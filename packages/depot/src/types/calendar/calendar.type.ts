import { EventInput } from "@fullcalendar/core";
import { IReservationContent, IReservation } from "../reservation";

export interface ICalendarEventInput extends EventInput {
  extendedProps: {
    contents: IReservationContent;
  };
}

export type ICalendarOutputType = IReservation[];
