import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import Dropdown from "react-bootstrap/Dropdown";
import moment from "moment";
import { useTranslation, withTranslation } from "react-i18next";
import {
  CalendarOptions,
  EventApi,
  EventInput,
  EventRemoveArg,
} from "@fullcalendar/core";
import { useLoginCheck } from "@/Hooks/useLoginCheck";
import { sendGet, sendPost } from "@Hooks/useApi";
import { ReservationType } from "@depot/types/reservation";

interface ResourceData {
  text: string;
  id: string;
  color: string;
}

interface AppointmentData {
  id: string;
  space: string;
  state: string;
}

interface CalendarProps {
  space_id: number;
  setSpace_id: React.SetStateAction<number>;
  date: Date;
  setDate: React.SetStateAction<Date>;
}

const resourcesData: ResourceData[] = [
  // Your resourcesData items
];

const spaceDict: { [key: string]: string } = {};
resourcesData.forEach((resource) => {
  spaceDict[resource.id] = resource.text;
});

const spaceDictAccepted: { [key: string]: string } = {};
resourcesData.slice(0, 13).forEach((resource) => {
  spaceDictAccepted[resource.id] = resource.text;
});

const Calendar: React.FC<CalendarProps> = ({
  space_id,
  setSpace_id,
  date,
  setDate,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [data, setData] = useState<EventInput[]>([]);
  const [selectedResource, setSelectedResource] = useState<string>(
    sessionStorage.getItem("filter") || "individual-practice-room1"
  );
  const { login, userInfo } = useLoginCheck();
  const { t } = useTranslation();

  useEffect(() => {
    if (sessionStorage.getItem("filter") === null) {
      sessionStorage.setItem("filter", "individual-practice-room1");
    }
  }, []);

  useEffect(() => {
    callApi(currentDate);
  }, [currentDate]);

  const callApi = async (date: Date) => {
    try {
      const res = await sendGet<ReservationType>(`/api/reservation/`);
      const newData = changeSpace(res);
      setData(newData);
    } catch (err) {
      console.log(err);
    }
  };

  const changeSpace = (data: AppointmentData[]): EventInput[] => {
    return data.map((r) => ({
      id: r.id,
      resourceId: r.space,
      start: new Date(), // Add appropriate start and end date handling here
      end: new Date(),
      title: r.state === "wait" ? r.space + " (미승인)" : r.space,
    }));
  };

  const handleDateClick = (arg: any) => {
    if (login && userInfo?.type === "admin") {
      // Show a form to create a new appointment
    }
  };

  const handleEventClick = (clickInfo: any) => {
    if (login && userInfo?.type === "admin") {
      // Show a form to edit the event
    }
  };

  const handleEventRemove = async (arg: EventRemoveArg) => {
    try {
      const res = await sendGet(`/api/reservation/delete?id=${arg.event.id}`);
      alert(res ? "삭제가 완료되었습니다." : "삭제에 실패했습니다.");
      callApi(new Date());
    } catch (err) {
      console.log(err);
    }
  };

  const handleEventAdd = async (eventData: EventInput) => {
    try {
      const res = await sendPost<ReservationType>(
        "/calendar",
        JSON.stringify(eventData)
      );

      alert(
        res
          ? "예약이 정상적으로 처리되었습니다."
          : "예약이 처리되지 않았습니다."
      );
      callApi(new Date());
    } catch (err) {
      console.log(err);
    }

    try {
      const res = await post(url, JSON.stringify(eventData), config);
      alert(
        res.data
          ? "예약이 정상적으로 처리되었습니다."
          : "예약이 처리되지 않았습니다."
      );
      callApi(new Date());
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container py-5">
      <div className="calendar form-inline shadow bg-white p-5">
        <Dropdown>
          <Dropdown.Toggle className="space-filter" id="dropdown-basic">
            {t(spaceDictAccepted[selectedResource])}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {Object.keys(spaceDictAccepted).map((space) => (
              <Dropdown.Item
                key={space}
                onClick={() => {
                  sessionStorage.setItem("filter", space);
                  setSelectedResource(space);
                }}
              >
                {t(spaceDictAccepted[space])}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, resourceTimelinePlugin]}
          initialView="dayGridMonth"
          events={data}
          resources={resourcesData.map((r) => ({
            id: r.id,
            title: r.text,
            backgroundColor: r.color,
          }))}
          editable={login && userInfo?.type === "admin"}
          selectable={login && userInfo?.type === "admin"}
          select={handleDateClick}
          eventClick={handleEventClick}
          eventRemove={handleEventRemove}
          eventAdd={handleEventAdd}
          height={1200}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
        />
      </div>
    </div>
  );
};

export default withTranslation()(Calendar);
