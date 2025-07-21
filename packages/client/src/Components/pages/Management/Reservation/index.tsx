import { Tabs } from "@chakra-ui/react";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import AllReservation from "@scspace-client/Components/organisms/Reservation/Listing/AllReservation";
import React from "react";

export default function ManageReservation() {
    const tabList: { [key: string]: React.ReactNode } = {
        List: <AllReservation />,
        Create: <div>Create a New Reservation</div>,
    };

    return (
        <Scroll>
            <Tabs.Root defaultValue={Object.keys(tabList)[0]} fitted >
                <Tabs.List>
                    {Object.keys(tabList).map((key) => (
                        <Tabs.Trigger key={key} value={key}>
                            {key}
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>
                {Object.entries(tabList).map(([key, content]) => (
                    <Tabs.Content key={key} value={key} minHeight={"full"}>
                        {content}
                    </Tabs.Content>
                ))}
            </Tabs.Root>
        </Scroll>
    );
}