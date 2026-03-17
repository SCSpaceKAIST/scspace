"use client"

import { Tabs } from "@chakra-ui/react";
import { useAuth } from "@scspace-client/Hooks/auth";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import RentalTable from "@scspace-client/Components/organisms/Rental/RentalList/RentalTable";
import { useRentalAPI } from "@scspace-client/Hooks/rental";
import { useMemo, useState } from "react";

export default function UserRental() {
    const { needLogin } = useAuth();
    needLogin();

    const { data: rentals, refetch } = useRentalAPI().myRentals;
    const [view, setView] = useState<"all" | "individual" | "organization">("all");

    const filteredRentals = useMemo(() => {
        if (!rentals) return [];
        if (view === "individual") return rentals.filter((rental) => rental.organizationId === 1);
        if (view === "organization") return rentals.filter((rental) => rental.organizationId !== 1);
        return rentals;
    }, [rentals, view]);

    return (
        <Scroll>
            {rentals ? (
                <>
                    <Tabs.Root value={view} onValueChange={(event) => setView(event.value as typeof view)} mb={4}>
                        <Tabs.List>
                            <Tabs.Trigger value="all">전체</Tabs.Trigger>
                            <Tabs.Trigger value="individual">개인</Tabs.Trigger>
                            <Tabs.Trigger value="organization">단체</Tabs.Trigger>
                        </Tabs.List>
                    </Tabs.Root>
                    <RentalTable
                        rentals={filteredRentals}
                        refetchAction={refetch}
                        showTabs
                        mode="user"
                        helperText="단체, 상태, 승인자를 함께 볼 수 있습니다. 행을 클릭하면 상세 정보를 확인할 수 있습니다."
                    />
                </>
            ) : (
                <LoadingComponent />
            )}
        </Scroll >
    );
}
