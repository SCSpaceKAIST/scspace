"use client"

import React from "react";
import { useAuth } from "@scspace-client/Hooks/auth";
import PageSelector, { IPage } from "../../molecules/page/PageSelector";
import ManageUser from "./ManageUser";

export default function Administration() {
    const { needAdmin } = useAuth();
    needAdmin();

    const pages: IPage[] = [
        {
            kor: "유저 관리",
            eng: "Manage user",
            preview: <ManageUser />,
            href: "/manage/user"
        }
    ]

    return (
        <PageSelector
            pages={pages}
        />
    );
}