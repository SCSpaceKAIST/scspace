"use client"

import { Box, Center, CheckboxCard, Grid, Separator, Stack, useBreakpointValue } from "@chakra-ui/react";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import { useGoodsAPI } from "@scspace-client/Hooks/rental";
import { useState } from "react";
import ManageBar from "../ManageGoods/ManageBar";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import GoodsListItem from "./GoodsListItem";

export interface ICartItem {
    id: number;
    name: string;
    count: number;
    countNow: number;
}

export default function GoodsList(props: {
    disabled?: boolean;
    manage?: boolean;
}) {
    const disabled = props.disabled ?? false;
    const manage = props.manage ?? false;
    const isWide = useBreakpointValue({ base: false, md: true });

    const {
        allGoods: {
            data: goodsListData,
            refetch: goodsListRefetch
        }
    } = useGoodsAPI();

    const [selected, setSelected] = useState<number | null>(null);

    // const goodsListData = [{
    //     id: 1,
    //     name: "Sample Good",
    //     description: "This is a sample good",
    //     countNow: 5,
    //     countAll: 10,
    //     imageId: 1
    // }, {
    //     id: 2,
    //     name: "Sample Good 2",
    //     description: "This is a sample good 2",
    //     countNow: 3,
    //     countAll: 8,
    //     imageId: 2
    // }, {
    //     id: 3,
    //     name: "Sample Good 3",
    //     description: "This is a sample good 3",
    //     countNow: 0,
    //     countAll: 5,
    //     imageId: 3
    // }, {
    //     id: 4,
    //     name: "Sample Good 4",
    //     description: "This is a sample good 4",
    //     countNow: 2,
    //     countAll: 6,
    //     imageId: 4
    // }, {
    //     id: 5,
    //     name: "Sample Good 5",
    //     description: "This is a sample good 5",
    //     countNow: 1,
    //     countAll: 3,
    //     imageId: 5
    // }, {
    //     id: 6,
    //     name: "Sample Good 6",
    //     description: "This is a sample good 6",
    //     countNow: 4,
    //     countAll: 10,
    //     imageId: 6
    // }];
    // const goodsListRefetch = () => { };

    return (!goodsListData || goodsListData.length === 0) ? (
        <LoadingComponent />
    ) : (<>
        {manage && (
            <ManageBar
                item={goodsListData.find(item => item.id === selected) ?? null}
                onChange={goodsListRefetch}
            />
        )}
        <Grid templateRows={"1fr auto"} height={"100%"}>
            <Scroll>
                <Stack p={2}>
                    {goodsListData.map(item => (
                        <GoodsListItem
                            key={item.name}
                            item={item}
                            isSelected={selected === item.id}
                            onSelect={id => setSelected((s) => s === id ? null : id)}
                            disabled={disabled}
                            isWide={isWide ?? false}
                            refetch={goodsListRefetch}
                            countAvailable={item.countNow}
                        />
                    ))}
                </Stack>
            </Scroll>
        </Grid>
    </>);
}
