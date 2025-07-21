"use client";

import React, { useEffect, useState } from "react";
import PageSelector, { IPage, } from "@scspace-client/Components/molecules/page/PageSelector";
import { useAllSpace } from "@scspace-client/Hooks/space";
import Calendar from "./Calendar";

export default function ResStatus() {
    const { spaces } = useAllSpace();
    const [spacePages, setSpacePages] = useState<IPage[]>([]);

    useEffect(() => {
        if (spaces) setSpacePages(
            spaces.map((s): IPage => {
                return {
                    href: `/reservation/status/${s.id}`,
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