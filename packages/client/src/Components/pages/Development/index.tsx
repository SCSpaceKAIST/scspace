"use client"

import React from "react";
import { useAuth } from "@scspace-client/Hooks/auth";
import PageSelector, { IPage } from "../../molecules/page/PageSelector";
import Atoms from "./Atoms";
import Molecules from "./Molecules";
import TestPage from "./Test";

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
            href: "/dev/molecules"
        },
        {
            kor: "Test",
            eng: "For Local Test",
            preview: <TestPage />,
            href: "/dev/test"
        }
    ]

    return (
        <PageSelector
            pages={pages}
        />
    );
}