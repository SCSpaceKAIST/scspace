"use client";

import { useAuth } from "@scspace-client/Hooks/auth";
import PageTemplete from "@scspace-client/Components/_commons/PageTemplete";
import ManageUser from "@scspace-client/Components/Manage/ManageUser";

export default function SpacePage() {
    const { needManager } = useAuth();
    needManager();

    return (
        <PageTemplete
            title={["운영", "유저"]}
            subtitle={["Administration", "User"]}
        >
            <ManageUser />
        </PageTemplete>
    );
}
