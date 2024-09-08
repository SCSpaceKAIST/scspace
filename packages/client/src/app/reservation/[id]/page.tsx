"use client";

import PageHeader from "@/Components/_commons/PageHeader";
import { useParams } from "next/navigation";
import {
  SpaceTypeEnum,
  SpaceTypeNames,
  SpaceTypesArray,
} from "@depot/types/space";
import SpaceView from "@/Components/Space/SpaceView";

export default function SpaceIntroPage() {
  const params = useParams();
  const id = parseInt(params.id as string, 10); // URL의 [id] 부분을 숫자로 변환

  if (isNaN(id) || id < 0 || id >= SpaceTypesArray.length) {
    // id가 유효한 숫자가 아닌 경우 처리
    return <p>Invalid ID provided.</p>;
  }
  return (
    <div>
      <PageHeader
        link_to_prop={"/space"}
        page_name={SpaceTypeNames[SpaceTypesArray[id]]}
        sub_name={"Spaces"}
      />
      <SpaceView space_id={id} />
    </div>
  );
}
