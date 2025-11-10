"use client"

import { Button, Collapsible, Stack, Tabs } from "@chakra-ui/react";
import OrgRule from "@scspace-client/Components/organisms/Rules/OrganizationRule";
import ResRule from "@scspace-client/Components/organisms/Rules/ReservationRule";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import React, { use, useEffect } from "react";
import SeminarLotteryRule from "@scspace-client/Components/organisms/Rules/SeminarLotteryRule";
import PerformanceLotteryRule from "@scspace-client/Components/organisms/Rules/PerformanceLotteryRule";
import { useRuleTopicStore } from "@scspace-client/Store/ruleTopic";
import RentalRule from "@scspace-client/Components/organisms/Rules/RentalRule";

const topics: { [key: string]: React.ReactNode } = {
    Reservation: (<ResRule />),
    Organization: (<OrgRule />),
    "Seminar-room Lottery": (<SeminarLotteryRule />),
    "Performance Period Lottery": (<PerformanceLotteryRule />),
    Rental: (<RentalRule />)
};

export default function Rules() {
    const { rule: topic, update } = useRuleTopicStore();

    useEffect(() => {
        if (!topic) {
            update(Object.keys(topics)[0]);
        }
    }, [topic, update]);

    return (
        <Scroll>
            <Tabs.Root
                value={topic}
                onValueChange={(v) => update(v.value)}
                variant={"enclosed"}
            >
                <Collapsible.Root>
                    <Stack>
                        <Collapsible.Content>
                            <Tabs.List w={"full"}>
                                <Stack w={"full"}>
                                    {Object.keys(topics).map((key) => (
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
                    Object.entries(topics).map(([key, content]) => (
                        <Tabs.Content key={key} value={key}>
                            {content}
                        </Tabs.Content>
                    ))
                }
            </Tabs.Root >
        </Scroll >
    );
}