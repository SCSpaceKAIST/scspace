"use client";
import PageHeader from "@scspace-client/Components/_commons/PageHeader";
import CalendarView from "@scspace-client/Components/Calendar/CalendarView";
import { useAuth } from "@scspace-client/Hooks/auth";
import { useSpaces } from "@scspace-client/Hooks/APIs/space/useSpaces";
import { useParams } from "next/navigation";
import IndividualForm from "@scspace-client/Components/Reservation/forms/IndividualForm";
import PianoForm from "@scspace-client/Components/Reservation/forms/PianoForm";
import SeminarForm from "@scspace-client/Components/Reservation/forms/SeminarForm";
import DanceForm from "@scspace-client/Components/Reservation/forms/DanceForm";
import GroupForm from "@scspace-client/Components/Reservation/forms/GroupForm";
import MiraeForm from "@scspace-client/Components/Reservation/forms/MiraeForm";
import SumiForm from "@scspace-client/Components/Reservation/forms/SumiForm";
import WorkForm from "@scspace-client/Components/Reservation/forms/WorkForm";
import OpenForm from "@scspace-client/Components/Reservation/forms/OpenForm";
import { useState } from "react";
import { SpaceTypeEnum } from "@scspace-depot/enums/space.enum";
export default function SpacePage() {
  const params = useParams();
  const id = parseInt(params.id as string, 10); // URL의 [id] 부분을 숫자로 변환
  const { needLogin } = useAuth();
  const [showCalendar, setShowCalendar] = useState(false);
  const { space } = useSpaces(id);
  needLogin();
  if (isNaN(id) || id <= 0 || id >= 18) {
    // 18 is the number of spaces
    // id가 유효한 숫자가 아닌 경우 처리
    return <div>Invalid ID provided.</div>;
  }

  const spaceComponent = {
    [SpaceTypeEnum.INDIVIDUAL]: <IndividualForm space={space} spaceId={id} />,
    [SpaceTypeEnum.PIANO]: <PianoForm space={space} spaceId={id} />,
    [SpaceTypeEnum.SEMINAR]: <SeminarForm space={space} spaceId={id} />,
    [SpaceTypeEnum.DANCE]: <DanceForm space={space} spaceId={id} />,
    [SpaceTypeEnum.GROUP]: <GroupForm space={space} spaceId={id} />,
    [SpaceTypeEnum.MIRAE]: <MiraeForm space={space} spaceId={id} />,
    [SpaceTypeEnum.SUMI]: <SumiForm space={space} spaceId={id} />,
    [SpaceTypeEnum.WORK]: <WorkForm space={space} spaceId={id} />,
    [SpaceTypeEnum.OPEN]: <OpenForm space={space} spaceId={id} />,
  };

  return (
    <div>
      <PageHeader
        link_to_prop={"/reservation"}
        page_name={`${space.name} 예약`}
        sub_name={`${space.nameEng} Reservation`}
      />
      <section>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className={showCalendar ? "modalButton1" : "modalButton2"}
        >
          {showCalendar ? "예약 접기" : "예약 보기"}
        </button>
        {showCalendar && (
          <CalendarView spaceId={id} space={space} date={new Date()} />
        )}
      </section>
      <section>{spaceComponent[space.spaceType]}</section>
    </div>
  );
}
