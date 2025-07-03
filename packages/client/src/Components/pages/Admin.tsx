"use client"

import React from "react";
import { useAuth } from "@scspace-client/Hooks/auth";
import PageSelector, { IPage } from "../templates/PageSelector";
import ManageUser from "../organisms/Manage/ManageUser";

export default function Admin() {
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