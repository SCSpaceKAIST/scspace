"use client"

import { useAuth } from "@scspace-client/Hooks/auth";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import RentalTable from "@scspace-client/Components/organisms/Rental/RentalList/RentalTable";
import { useRentalAPI } from "@scspace-client/Hooks/rental";

export default function UserRental() {
    const { userInfo, needLogin } = useAuth();
    needLogin();

    const { data: rentals, refetch } = useRentalAPI().myRentals;

    return (
        <Scroll>
            {rentals ? (
                <RentalTable
                    rentals={rentals}
                    refetch={refetch}
                    uid={userInfo?.id ?? 0}
                    showTabs
                />
            ) : (
                <LoadingComponent />
            )}
        </Scroll >
    );
}