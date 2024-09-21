import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import { EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import Dropdown from "react-bootstrap/Dropdown";
import moment from "moment";
import { useLoginCheck } from "@/Hooks/useLoginCheck";
import { sendGet } from "@Hooks/useApi";
import {
  ReservationOutputType,
  ReservationType,
} from "@depot/types/reservation";
import { SpaceType, SpaceTypeEnum } from "@depot/types/space";
import { useSpaces } from "@/Hooks/useSpaces";
import { useLinkPush } from "@/Hooks/useLinkPush";
import { Tooltip } from "react-tooltip"; // 수정된 import 문
import ReservationModal, {
  handleReservationSubmit,
} from "@Components/Reservation/ReservationModal";
import { UserType } from "@depot/types/user";

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
  // 필요한 리소스 데이터를 여기에 추가하세요
];

type ReservationEvent = EventInput & {
  extendedProps: {
    reservation: ReservationType & {
      name: string;
      space_type: SpaceTypeEnum;
      user_id: string;
    };
  };
};

const spaceDict: { [key: string]: string } = {};
resourcesData.forEach((resource) => {
  spaceDict[resource.id] = resource.text;
});

const CalendarView: React.FC<CalendarProps> = ({ space_id, space }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [data, setData] = useState<ReservationEvent[]>([]);
  const { login, userInfo } = useLoginCheck();
  const { spaceArray, loaded } = useSpaces(space_id);
  const { linkPush } = useLinkPush();
  const [reservations, setReservations] = useState<ReservationType[]>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationType | null>(null);
  const [selectedReserverInfo, setSelectedReserverInfo] =
    useState<UserType | null>(null);

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  const handleReservationClick = (info: any) => {
    const reservation = info.event.extendedProps.reservation;
    setSelectedReservation(reservation);
    setSelectedReserverInfo(
      userInfo && userInfo?.user_id === reservation.user_id ? userInfo : null
    );
    setShowModal(true);
  };

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

  const changeSpace = (data: ReservationType[]): ReservationEvent[] => {
    if (!spaceArray) return [];
    return data.map((r) => ({
      id: r.reservation_id.toString(),
      resourceId:
        spaceArray.find((space) => space.space_id === r.space_id)?.name || "",
      start: r.time_from,
      end: r.time_to,
      title: `${r.state === "grant" ? "" : "[미승인] "}${moment(r.time_from).format("HH:mm")} - ${moment(
        r.time_to
      ).format("HH:mm")} | ${r.user_id}`,

      extendedProps: {
        user_id: r.user_id,
        reservation: {
          ...r,
          name: space.name,
          space_type: space.space_type,
          user_id: r.user_id,
        },
      },
    }));
  };

  const handleEventClick = (info: any) => {
    const event = info.event;

    // moment를 사용하여 날짜 형식을 MM:DD HH:MM으로 변환
    const formattedStart = moment(event.start).format("MM월 DD일 HH:mm");
    const formattedEnd = moment(event.end).format("MM월 DD일 HH:mm");
    alert(
      `Reservation ID: ${event.id}\nUser ID: ${event.extendedProps.user_id}\nFrom: ${formattedStart}\nTo: ${formattedEnd}`
    );
  };

  const handleEventMouseEnter = (info: any) => {
    const event = info.event;
    // 추가적인 이벤트 정보를 표시하려면 이곳에 코드를 추가하세요
  };

  const eventContent = (eventInfo: any) => {
    return (
      <>
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          data-tooltip-id="event-tooltip"
          data-tooltip-content={eventInfo.event.title}
        >
          <b>{eventInfo.event.title}</b>
        </div>
        <Tooltip id="event-tooltip" place="top" />
      </>
    );
  };

  return (
    <div className="container py-5">
      <div className="calendar form-inline shadow bg-white p-5">
        <Dropdown>
          <Dropdown.Toggle className="space-filter" id="dropdown-basic">
            {space.name}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {spaceArray?.map((one_space) => (
              <Dropdown.Item
                key={one_space.space_id}
                onClick={() => linkPush(`/calendar/${one_space.space_id}`)}
              >
                {one_space.name}
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
          eventClick={handleReservationClick}
          //eventClick={handleEventClick}
          eventMouseEnter={handleEventMouseEnter}
          eventContent={eventContent}
        />
      </div>
      <ReservationModal
        showHide={showModal}
        setShowHide={handleShowModal}
        reservationInfo={selectedReservation}
        reserverInfo={selectedReserverInfo}
        setReservationInfo={setSelectedReservation}
        handleSubmit={() => {}}
      />
    </div>
  );
};

export default CalendarView;
