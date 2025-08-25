import { Tabs } from "@chakra-ui/react";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import { AddGoods } from "@scspace-client/Components/organisms/Rental/AddGoods";
import GoodsList from "@scspace-client/Components/organisms/Rental/List";
import React from "react";

export default function ManageRental() {
    const tabList: { [key: string]: React.ReactNode } = {
        History: <>Will be implemented</>,
        List: <GoodsList />,
        "Add Goods": <AddGoods />
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