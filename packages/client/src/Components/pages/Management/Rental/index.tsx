"use client"

import { Tabs, useTabs } from "@chakra-ui/react";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import { AddGoods } from "@scspace-client/Components/organisms/Rental/AddGoods";
import GoodsList from "@scspace-client/Components/organisms/Rental/List";
import React from "react";

export default function ManageRental() {
    const tabList: { [key: string]: React.ReactNode } = {
        History: <>Will be implemented</>,
        "Manage Goods": <GoodsList manage />,
        "Add Goods": <AddGoods />
    };

    const tabs = useTabs({
        defaultValue: Object.keys(tabList)[0],
    });

    return (
        <Scroll>
            <Tabs.RootProvider value={tabs} fitted minHeight={"full"}>
                <Tabs.List>
                    {Object.keys(tabList).map((key) => (
                        <Tabs.Trigger key={key} value={key}>
                            {key}
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>
                {Object.entries(tabList)
                    .filter(([key, _]) => key === tabs.value)
                    .map(([key, content]) => (
                        <Tabs.Content key={key} value={key} minHeight={"full"}>
                            {content}
                        </Tabs.Content>
                    ))
                }
            </Tabs.RootProvider>
        </Scroll>
    );
}