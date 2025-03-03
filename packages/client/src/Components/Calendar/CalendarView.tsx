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
import { IReservation, IReservationResponse } from "@depot/types/reservation";
import { ISpace } from "@depot/types/space";
import { useSpaces } from "@/Hooks/useSpaces";
import { useLinkPush } from "@/Hooks/useLinkPush";
import { Tooltip } from "react-tooltip"; // 수정된 import 문
import ReservationModal, {
  handleReservationSubmit,
} from "@Components/Reservation/ReservationModal";
import { IUser } from "@depot/types/user";
import { ReservationStateEnum } from "@depot/enums/reservation.enum";
import { UserTypeEnum } from "@depot/enums/user.enum";

interface ResourceData {
  text: string;
  id: string;
  color: string;
}

interface CalendarProps {
  spaceId: number;
  space: ISpace;
  date: Date;
}

const resourcesData: ResourceData[] = [
  // 필요한 리소스 데이터를 여기에 추가하세요
];

type ReservationEvent = EventInput & {
  extendedProps: {
    reservation: IReservation & {
      name: string;
      spaceType: ISpace["spaceType"];
      userId: number;
    };
  };
};

const spaceDict: { [key: string]: string } = {};
resourcesData.forEach((resource) => {
  spaceDict[resource.id] = resource.text;
});

const CalendarView: React.FC<CalendarProps> = ({ spaceId, space }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [data, setData] = useState<ReservationEvent[]>([]);
  const { login, userInfo } = useLoginCheck();
  const { spaceArray, loaded } = useSpaces(spaceId);
  const { linkPush } = useLinkPush();
  const [reservations, setReservations] = useState<IReservation[]>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedReservation, setSelectedReservation] =
    useState<IReservationResponse | null>(null);
  const [selectedReserverInfo, setSelectedReserverInfo] =
    useState<IUser | null>(null);

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  const handleReservationClick = (info: any) => {
    const reservation = info.event.extendedProps.reservation;
    setSelectedReservation(reservation);
    setSelectedReserverInfo(
      userInfo && userInfo?.id === reservation.userId ? userInfo : null
    );
    setShowModal(true);
  };

  useEffect(() => {
    callApi();
  }, [spaceArray]);

  const callApi = async () => {
    try {
      const res = await sendGet<IReservationResponse[] | false>(
        `/reservation/space/${spaceId}`
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

  const changeSpace = (data: IReservationResponse[]): ReservationEvent[] => {
    if (!spaceArray) return [];
    return data.map((r) => ({
      id: r.id.toString(),
      resourceId:
        spaceArray.find((space) => space.id === r.spaceId)?.name || "",
      start: r.timeFrom,
      end: r.timeTo,
      title: `${r.state === ReservationStateEnum.GRANT ? "" : "[미승인] "}${moment(r.timeFrom).format("HH:mm")} - ${moment(
        r.timeTo
      ).format("HH:mm")} | ${r.userId}`,

      extendedProps: {
        userId: r.userId,
        reservation: {
          ...r,
          name: space.name,
          spaceType: space.spaceType,
          userId: r.userId,
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
      `Reservation ID: ${event.id}\nUser ID: ${event.extendedProps.userId}\nFrom: ${formattedStart}\nTo: ${formattedEnd}`
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
                key={one_space.id}
                onClick={() => linkPush(`/calendar/${one_space.id}`)}
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
          editable={login && userInfo?.type === UserTypeEnum.ADMIN}
          selectable={login && userInfo?.type === UserTypeEnum.ADMIN}
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
