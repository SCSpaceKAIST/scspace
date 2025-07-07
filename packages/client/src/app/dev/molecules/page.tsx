"use client";

import { useAuth } from "@scspace-client/Hooks/auth";
import PageTemplete from "@scspace-client/Components/templates/PageTemplete";
import Atoms from "@scspace-client/Components/pages/Atoms";

export default function SpacePage() {
    const { needAdmin } = useAuth();
    // needAdmin();

    return (
        <PageTemplete
            title={["개발", "Molecules"]}
            subtitle={["Development", "Components"]}
        >
            <Atoms />
        </PageTemplete>
    );
}
