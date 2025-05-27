"use client";

import { useParams } from "next/navigation";
import PageTemplete from "@scspace-client/Components/_commons/PageTemplete";
import { useSpace } from "@scspace-client/Hooks/space";
import LoadingComponent from "@scspace-client/Components/Loading/Loading";
import Calendar from "@scspace-client/Components/Calendar/Calendar";

export default function SpacePage() {
    const params = useParams();
    const id = parseInt(params.id as string, 10);

    const { space } = useSpace({ id: id });

    return (space ? (
        <PageTemplete
            title={["예약 현황", space.nameKr]}
            subtitle={["Calendar", space.nameEn]}
        >
            <Calendar spaceId={space.id} />
        </PageTemplete>
    ) : (
        <LoadingComponent />
    ));
}
