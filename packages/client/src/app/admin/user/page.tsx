"use client";

import { useAuth } from "@scspace-client/Hooks/auth";
import PageTemplete from "@scspace-client/Components/pages/layouts/PageTemplete";
import ManageUser from "@scspace-client/Components/pages/ManageUser";

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
