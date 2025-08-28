"use client"

import { useAuth } from "@scspace-client/Hooks/auth";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import RentalTable from "@scspace-client/Components/organisms/Rental/RentalList/RentalTable";
import { useRentalAPI } from "@scspace-client/Hooks/rental";

export default function RentalHistory() {
    const { needManager } = useAuth();
    needManager();

    const { data: rentals, refetch } = useRentalAPI().allRentals;

    return (
        <Scroll>
            {rentals ? (
                <RentalTable
                    rentals={rentals.data ?? []}
                    refetch={refetch}
                    showTabs
                />
            ) : (
                <LoadingComponent />
            )}
        </Scroll >
    );
}