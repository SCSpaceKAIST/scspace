import { Tabs } from "@chakra-ui/react";
import ResRule from "@scspace-client/Components/organisms/Rules/reservation";
import Scroll from "@scspace-client/Components/pages/Layout/Scroll";
import React from "react";

export default function Rules() {
    const tabList: { [key: string]: React.ReactNode } = {
        reservation: (<ResRule />)
    };

    return (
        <Scroll>
            <Tabs.Root>
                <Tabs.List>
                    {Object.keys(tabList).map((key) => (
                        <Tabs.Trigger key={key} value={key}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}
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