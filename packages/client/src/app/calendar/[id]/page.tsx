"use client";

import PageHeader from "@/Components/_commons/PageHeader";
import { useParams } from "next/navigation";
import {
  SpaceTypeEnum,
  SpaceTypeNames,
  SpaceTypesArray,
} from "@depot/types/space";
import SpaceView from "@/Components/Space/SpaceView";
import FormIndividual from "@/Components/Reservation/FormIndividual";
import { useLoginCheck } from "@/Hooks/useLoginCheck";
import { useEffect, useState } from "react";
import { SpaceType } from "@depot/types/space";
import { sendGet } from "@/Hooks/useApi";
import CalendarView from "@/Components/Calendar/CalendarView";
import { useSpaces } from "@/Hooks/useSpaces";
import { get } from "http";

export default function SpaceIntroPage() {
  const params = useParams();
  const id = parseInt(params.id as string, 10); // URL의 [id] 부분을 숫자로 변환
  const { login, userInfo } = useLoginCheck();

  if (isNaN(id) || id <= 0 || id >= 18) {
    // 18 is the number of spaces
    // id가 유효한 숫자가 아닌 경우 처리
    return <p>Invalid ID provided.</p>;
  }

  const { space } = useSpaces(id);
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
