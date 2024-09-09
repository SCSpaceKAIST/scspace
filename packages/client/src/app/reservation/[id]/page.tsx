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
import { sendGet } from "@/Hooks/useApi";
import { SpaceType } from "@depot/types/space";
import { useSpaces } from "@/Hooks/useSpaces";
import { get } from "http";

export default function SpaceIntroPage() {
  const params = useParams();
  const id = parseInt(params.id as string, 10); // URL의 [id] 부분을 숫자로 변환
  const { login, userInfo, needLogin } = useLoginCheck();

  const { space } = useSpaces(id);
  needLogin();
  if (isNaN(id) || id < 1 || id >= 18) {
    // id가 유효한 숫자가 아닌 경우 처리
    return <p>Invalid ID provided.</p>;
  }
  return (
    <div>
      <PageHeader
        link_to_prop={"/reservation"}
        page_name={space ? space.name : ""}
        sub_name={"Reservation"}
      />
      {userInfo ? <FormIndividual /> : <div />}
    </div>
  );
}
