"use client"

import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import GoodsList from "@scspace-client/Components/organisms/Rental/GoodsList";
import { useAuth } from "@scspace-client/Hooks/auth";

export default function RentalApplication() {
    const { isManager } = useAuth();

    return (
        <Scroll>
            <GoodsList
                disabled={!isManager}
            />
        </Scroll>
    );
}
