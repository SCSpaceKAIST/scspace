"use client";

import React, { useEffect, useState } from "react";
import PageSelector, { IPage, } from "../../atoms/PageSelector";
import { useAllSpace } from "@scspace-client/Hooks/space";
import Calendar from "../../templates/Calendar";

export default function SpaceCalendar() {
    const { spaces } = useAllSpace();
    const [spacePages, setSpacePages] = useState<IPage[]>([]);

    useEffect(() => {
        if (spaces) setSpacePages(
            spaces.map((s): IPage => {
                return {
                    href: `/calendar/${s.id}`,
                    kor: s.nameKr,
                    eng: s.nameEn,
                    preview: (<Calendar spaceId={s.id} />)
                }
            }));
    }, [spaces]);

    return (
        <PageSelector
            pages={spacePages}
        />
    );
}