import { Tabs } from "@chakra-ui/react";
import OrgRule from "@scspace-client/Components/organisms/Rules/OrganizationRule";
import ResRule from "@scspace-client/Components/organisms/Rules/ReservationRule";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import React from "react";
import SeminarLotteryRule from "@scspace-client/Components/organisms/Rules/SeminarLotteryRule";

export default function Rules() {
    const tabList: { [key: string]: React.ReactNode } = {
        Reservation: (<ResRule />),
        Organization: (<OrgRule />),
        "Seminar-room Recurring Reservation": (<SeminarLotteryRule />)
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