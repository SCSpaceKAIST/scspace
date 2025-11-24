"use client"

import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import GoodsList from "@scspace-client/Components/organisms/Rental/GoodsList";
import { useAuth } from "@scspace-client/Hooks/auth";

export default function RentalApplication() {
    const { isLogined } = useAuth();

    return (
        <Scroll>
            <GoodsList
                // disabled={!isLogined}
                disabled
            />
        </Scroll>
    );
}
