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
                            manage={manage}
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
