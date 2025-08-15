import { Tabs } from "@chakra-ui/react";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import React from "react";

export default function ManagePerformanceLottery() {
    const tabList: { [key: string]: React.ReactNode } = {
        "공연집중기간 추첨 날짜": <div>Performance Lottery Info will be implemented here</div>,
        "공연집중기간 추첨 결과 변경": <div>Performance Lottery Admin will be implemented here</div>,
    };

    return (
        <Scroll>
            <Tabs.Root defaultValue={Object.keys(tabList)[0]} fitted minHeight={"full"}>
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
