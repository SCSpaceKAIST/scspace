"use client";
import PageHeader from "@/Components/_commons/PageHeader";
import CalendarView from "@/Components/Calendar/CalendarView";
import { useLoginCheck } from "@/Hooks/useLoginCheck";
import { useSpaces } from "@/Hooks/useSpaces";
import { useParams } from "next/navigation";
import IndividualForm from "@/Components/Reservation/forms/IndividualForm";
import PianoForm from "@/Components/Reservation/forms/PianoForm";
import SeminarForm from "@/Components/Reservation/forms/SeminarForm";
import DanceForm from "@/Components/Reservation/forms/DanceForm";
import GroupForm from "@/Components/Reservation/forms/GroupForm";
import MiraeForm from "@/Components/Reservation/forms/MiraeForm";
import SumiForm from "@/Components/Reservation/forms/SumiForm";
import WorkForm from "@/Components/Reservation/forms/WorkForm";
import OpenForm from "@/Components/Reservation/forms/OpenForm";
import { useState } from "react";

export default function SpacePage() {
  const params = useParams();
  const id = parseInt(params.id as string, 10); // URL의 [id] 부분을 숫자로 변환
  const { login, userInfo, needLogin } = useLoginCheck();
  const [showCalendar, setShowCalendar] = useState(false);
  const { space } = useSpaces(id);
  needLogin();
  if (isNaN(id) || id <= 0 || id >= 18) {
    // 18 is the number of spaces
    // id가 유효한 숫자가 아닌 경우 처리
    return <p>Invalid ID provided.</p>;
  }

  const spaceComponent = {
    individual: <IndividualForm space={space} spaceId={id} />,
    piano: <PianoForm space={space} spaceId={id} />,
    seminar: <SeminarForm space={space} spaceId={id} />,
    dance: <DanceForm space={space} spaceId={id} />,
    group: <GroupForm space={space} spaceId={id} />,
    mirae: <MiraeForm space={space} spaceId={id} />,
    sumi: <SumiForm space={space} spaceId={id} />,
    work: <WorkForm space={space} spaceId={id} />,
    open: <OpenForm space={space} spaceId={id} />,
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
