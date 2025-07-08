"use client";

import { useAuth } from "@scspace-client/Hooks/auth";
import PageTemplete from "@scspace-client/Components/pages/layouts/PageTemplete";
import Atoms from "@scspace-client/Components/pages/Atoms";

export default function SpacePage() {
    const { needAdmin } = useAuth();
    // needAdmin();

    return (
        <PageTemplete
            title={["개발", "Atoms"]}
            subtitle={["Development", "Components"]}
        >
            <Atoms />
        </PageTemplete>
    );
}
