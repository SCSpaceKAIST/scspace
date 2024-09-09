import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import Dropdown from "react-bootstrap/Dropdown";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useLoginCheck } from "@/Hooks/useLoginCheck";
import { sendGet } from "@Hooks/useApi";
import { ReservationType } from "@depot/types/reservation";
import { SpaceType } from "@depot/types/space";
import { useSpaces } from "@/Hooks/useSpaces";
import { useLinkPush } from "@/Hooks/useLinkPush";
import { EventInput } from "@fullcalendar/core";

interface ResourceData {
  text: string;
  id: string;
  color: string;
}

interface CalendarProps {
  space_id: number;
  space: SpaceType;
  date: Date;
}

const resourcesData: ResourceData[] = [
  // Your resourcesData items
];

const spaceDict: { [key: string]: string } = {};
resourcesData.forEach((resource) => {
  spaceDict[resource.id] = resource.text;
});

const CalendarView: React.FC<CalendarProps> = ({ space_id, space }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [data, setData] = useState<EventInput[]>([]);
  const { login, userInfo } = useLoginCheck();
  const { t } = useTranslation();
  const { spaceArray, loaded } = useSpaces(space_id);
  const { linkPush } = useLinkPush();
  const [reservations, setReservations] = useState<ReservationType[]>();

  useEffect(() => {
    callApi();
  }, [spaceArray]);

  const callApi = async () => {
    try {
      const res = await sendGet<ReservationType[] | false>(
        `/reservation/space/${space_id}`
      );
      if (res !== false) {
        setReservations(res);
        const newData = changeSpace(res);
        setData(newData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const changeSpace = (data: ReservationType[]): EventInput[] => {
    if (!spaceArray) return [];
    return data.map((r) => ({
      id: r.reservation_id.toString(),
      resourceId: spaceArray[r.space_id]?.name || "", // Ensure this mapping is correct
      start: r.time_from, // FullCalendar expects ISO date strings or JavaScript Date objects
      end: r.time_to,
      title: `${moment(r.time_from).format("HH:mm")} - ${moment(r.time_to).format("HH:mm")} ${r.user_id}`,
      extendedProps: { user_id: r.user_id },
    }));
  };

  const handleEventClick = (info: any) => {
    const event = info.event;
    alert(
      `Reservation ID: ${event.id}\nUser ID: ${event.extendedProps.user_id}\nFrom: ${event.start.toISOString()}\nTo: ${event.end.toISOString()}`
    );
  };

  const handleEventMouseEnter = (info: any) => {
    const event = info.event;
    // Optionally show additional details in a tooltip or popup
    console.log(
      `Event details:\nFrom: ${event.start.toISOString()}\nTo: ${event.end.toISOString()}\nUser ID: ${event.extendedProps.user_id}`
    );
  };

  const eventContent = (eventInfo: any) => {
    return (
      <div>
        <b>{eventInfo.event.title}</b>
      </div>
    );
  };

  return (
    <div className="container py-5">
      <div className="calendar form-inline shadow bg-white p-5">
        <Dropdown>
          <Dropdown.Toggle className="space-filter" id="dropdown-basic">
            {t(space.name)}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {spaceArray?.map((one_space) => (
              <Dropdown.Item
                key={one_space.space_id}
                onClick={() => linkPush(`/calendar/${one_space.space_id}`)}
              >
                {t(one_space.name)}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, resourceTimelinePlugin]}
          initialView="dayGridMonth"
          events={data}
          editable={login && userInfo?.type === "admin"}
          selectable={login && userInfo?.type === "admin"}
          height={1000}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          eventClick={handleEventClick}
          eventMouseEnter={handleEventMouseEnter}
          eventContent={eventContent}
        />
      </div>
    </div>
  );
};

export default CalendarView;
