"use client"

import React from "react";
import { useAuth } from "@scspace-client/Hooks/auth";
import PageSelector, { IPage } from "../templates/PageSelector";
import Atoms from "./Atoms";
import Molecules from "./Molecules";

export default function Development() {
    const { needAdmin } = useAuth();
    // needAdmin();

    const pages: IPage[] = [
        {
            kor: "Atoms",
            eng: "Components",
            preview: <Atoms />,
            href: "/dev/atoms"
        },
        {
            kor: "Molecules",
            eng: "Components",
            preview: <Molecules />,
            href: "/dev/Molecules"
        }
    ]

    return (
        <PageSelector
            pages={pages}
        />
    );
}