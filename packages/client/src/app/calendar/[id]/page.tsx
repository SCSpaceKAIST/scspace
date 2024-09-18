"use client";

import PageHeader from "@/Components/_commons/PageHeader";
import { useParams } from "next/navigation";
import { useLoginCheck } from "@/Hooks/useLoginCheck";
import CalendarView from "@/Components/Calendar/CalendarView";
import { useSpaces } from "@/Hooks/useSpaces";

export default function SpaceIntroPage() {
  const params = useParams();
  const id = parseInt(params.id as string, 10); // URL의 [id] 부분을 숫자로 변환
  const { space } = useSpaces(id);

  if (isNaN(id) || id <= 0 || id >= 18) {
    // 18 is the number of spaces

    // id가 유효한 숫자가 아닌 경우 처리
    return <p>Invalid ID provided.</p>;
  }
  return (
    <div>
      <PageHeader
        link_to_prop={"/calendar"}
        page_name={space.name}
        sub_name={"Calendar"}
      />
      <CalendarView space_id={id} space={space} date={new Date()} />
    </div>
  );
}
