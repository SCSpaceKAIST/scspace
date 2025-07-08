"use client";

import { useAuth } from "@scspace-client/Hooks/auth";
import PageTemplete from "@scspace-client/Components/pages/layouts/PageTemplete";
import Molecules from "@scspace-client/Components/pages/Molecules";

export default function SpacePage() {
    const { needAdmin } = useAuth();
    // needAdmin();

    return (
        <PageTemplete
            title={["개발", "Molecules"]}
            subtitle={["Development", "Components"]}
        >
            <Molecules />
        </PageTemplete>
    );
}
