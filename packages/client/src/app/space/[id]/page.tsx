"use client";

import { useParams } from "next/navigation";
import { SpaceTypeNames, SpaceTypesArray } from "@scspace-depot/types/space";
import SpaceView from "@scspace-client/Components/Space/SpaceView";
import PageTemplete from "@scspace-client/Components/_commons/PageTemplete";

export default function SpaceIntroPage() {
  const params = useParams();
  const id = parseInt(params.id as string, 10); // URL의 [id] 부분을 숫자로 변환

  // if (isNaN(id) || id < 0 || id >= SpaceTypesArray.length) {
  //   // id가 유효한 숫자가 아닌 경우 처리
  //   return <div>Invalid ID provided.</div>;
  // }
  return (
    <PageTemplete
      title="Space Detail"
      subtitle="Space Detail"
    >
      {id}
    </PageTemplete>
  );
}
