import { Tabs } from "@chakra-ui/react";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import React from "react";

export default function ManageReservation() {
    const tabList: { [key: string]: React.ReactNode } = {
        List: <div>List of Reservations</div>,
        Create: <div>Create a New Reservation</div>,
    };

    return (
        <Scroll>
            <Tabs.Root defaultValue={Object.keys(tabList)[1]} fitted>
                <Tabs.List>
                    {Object.keys(tabList).map((key) => (
                        <Tabs.Trigger key={key} value={key}>
                            {key}
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>
                {Object.entries(tabList).map(([key, content]) => (
                    <Tabs.Content key={key} value={key}>
                        {content}
                    </Tabs.Content>
                ))}
            </Tabs.Root>
        </Scroll>
    );
}