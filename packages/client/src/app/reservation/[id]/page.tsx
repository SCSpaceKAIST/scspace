"use client";
import PageHeader from "@/Components/_commons/PageHeader";

import CalendarView from "@/Components/Calendar/CalendarView";
import TestForm from "@/Components/Reservation/forms/TestForm";
import { useLoginCheck } from "@/Hooks/useLoginCheck";
import { useSpaces } from "@/Hooks/useSpaces";
import { useParams } from "next/navigation";
import IndividualForm from "@/Components/Reservation/forms/IndividualForm";
import { useState } from "react";
import { SpaceType } from "@depot/types/space";

export default function SpacePage() {
  const params = useParams();
  const id = parseInt(params.id as string, 10); // URL의 [id] 부분을 숫자로 변환
  const { login, userInfo, needLogin } = useLoginCheck();
  needLogin();
  if (isNaN(id) || id <= 0 || id >= 18) {
    // 18 is the number of spaces
    // id가 유효한 숫자가 아닌 경우 처리
    return <p>Invalid ID provided.</p>;
  }
  const [showCalendar, setShowCalendar] = useState(false);
  const { space } = useSpaces(id);

  const spaceComponent = {
    individual: <IndividualForm space={space} space_id={id} />,
  };
  // const spaceComponent = {
  //   individual: <IndividualForm space={space} space_id={id} />,
  //   piano: <PianoForm space={space} space_id={id} />,
  //   seminar: <SeminarForm space={space} space_id={id} />,
  //   dance: <DanceForm space={space} space_id={id} />,
  //   group: <GroupForm space={space} space_id={id} />,
  //   mirae: <MiraeForm space={space} space_id={id} />,
  //   sumi: <SumiForm space={space} space_id={id} />,
  //   open: <OpenForm space={space} space_id={id} />,
  //   work: <WorkForm space={space} space_id={id} />,
  // };

  return (
    <div>
      <PageHeader
        link_to_prop={"/reservation"}
        page_name={"예약"}
        sub_name="Reservation"
      />
      <section>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="modalButton1"
        >
          예약 보기
        </button>
        {showCalendar && (
          <CalendarView space_id={id} space={space} date={new Date()} />
        )}
      </section>

      {spaceComponent[space.space_type]}
    </div>
  );
}
