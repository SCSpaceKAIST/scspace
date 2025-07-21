import { Tabs } from "@chakra-ui/react";
import OrgRule from "@scspace-client/Components/organisms/Rules/organization";
import ResRule from "@scspace-client/Components/organisms/Rules/reservation";
import Scroll from "@scspace-client/Components/pages/Layout/Scroll";
import React from "react";

export default function Rules() {
    const tabList: { [key: string]: React.ReactNode } = {
        Reservation: (<ResRule />),
        Organization: (<OrgRule />)
    };

    return (
        <Scroll>
            <Tabs.Root defaultValue={Object.keys(tabList)[0]} fitted>
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