import { Button, Collapsible, Stack, Tabs } from "@chakra-ui/react";
import OrgRule from "@scspace-client/Components/organisms/Rules/OrganizationRule";
import ResRule from "@scspace-client/Components/organisms/Rules/ReservationRule";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import React from "react";
import SeminarLotteryRule from "@scspace-client/Components/organisms/Rules/SeminarLotteryRule";
import PerformanceLotteryRule from "@scspace-client/Components/organisms/Rules/PerformanceLotteryRule";

export default function Rules() {
    const tabList: { [key: string]: React.ReactNode } = {
        Reservation: (<ResRule />),
        Organization: (<OrgRule />),
        "Seminar-room Recurring Reservation": (<SeminarLotteryRule />),
        "Performance Concentration Period": (<PerformanceLotteryRule />)
    };

    return (
        <Scroll>
            <Tabs.Root defaultValue={Object.keys(tabList)[1]} variant={"enclosed"}>
                <Collapsible.Root>
                    <Stack>
                        <Collapsible.Content>
                            <Tabs.List w={"full"}>
                                <Stack w={"full"}>
                                    {Object.keys(tabList).map((key) => (
                                        <Tabs.Trigger key={key} value={key} whiteSpace={"nowrap"} width={"full"} textAlign={"center"}>
                                            {key}
                                        </Tabs.Trigger>
                                    ))}
                                </Stack>
                            </Tabs.List>
                        </Collapsible.Content>
                        <Collapsible.Trigger asChild>
                            <Button w={"full"} variant={"outline"} colorPalette={"blue"} size={"sm"}>
                                Select Topic
                            </Button>
                        </Collapsible.Trigger>
                    </Stack>
                </Collapsible.Root>
                {
                    Object.entries(tabList).map(([key, content]) => (
                        <Tabs.Content key={key} value={key}>
                            {content}
                        </Tabs.Content>
                    ))
                }
            </Tabs.Root >
        </Scroll >
    );
}