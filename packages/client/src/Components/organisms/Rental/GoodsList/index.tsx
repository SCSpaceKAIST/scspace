"use client"

import { Alert, Grid, Stack, useBreakpointValue } from "@chakra-ui/react";
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

    return (!goodsListData) ? (
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
                    <Alert.Root status={"error"}>
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>현재 대여 신청은 일시적으로 중단되었습니다.</Alert.Title>
                            <Alert.Description>Rental Application page is under update.</Alert.Description>
                        </Alert.Content>
                    </Alert.Root>
                    {goodsListData.map(item => (
                        <GoodsListItem
                            key={`${item.name}-${item.id}`}
                            item={item}
                            isSelected={selected === item.id}
                            onSelectAction={id => setSelected((s) => s === id ? null : id)}
                            disabled={disabled}
                            manage={manage}
                            isWide={isWide ?? false}
                            refetchAction={goodsListRefetch}
                            countAvailable={item.countNow}
                        />
                    ))}
                </Stack>
            </Scroll>
        </Grid>
    </>);
}
