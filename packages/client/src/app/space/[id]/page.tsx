"use client";

import { useParams } from "next/navigation";
import PageTemplete from "@scspace-client/Components/_commons/PageTemplete";
import { useSpace } from "@scspace-client/Hooks/space";
import LoadingComponent from "@scspace-client/Components/Loading/Loading";
import SpaceIntro from "@scspace-client/Components/Space/SpaceIntro";

export default function SpaceIntroPage() {
  const params = useParams();
  const id = parseInt(params.id as string, 10);

  const { space } = useSpace({ id: id });

  return (space ? (
    <PageTemplete
      title={["공간", space.nameKr]}
      subtitle={["Space", space.nameEn]}
    >
      <SpaceIntro space={space} />
    </PageTemplete>
  ) : (
    <LoadingComponent />
  ));
}
