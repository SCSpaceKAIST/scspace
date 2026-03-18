"use client"

import { Alert, Grid, Stack, useBreakpointValue } from "@chakra-ui/react";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import { useAuth } from "@scspace-client/Hooks/auth";
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
    const { isLogined, isManager } = useAuth();

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
                    {disabled && !manage && (
                        <Alert.Root status={"warning"}>
                            <Alert.Indicator />
                            <Alert.Content>
                                <Alert.Title>{isLogined ? "공간위원만 대여 등록이 가능합니다." : "로그인이 필요합니다."}</Alert.Title>
                                <Alert.Description>
                                    {isLogined && !isManager
                                        ? "현재 대여 등록은 공간위원만 진행할 수 있습니다."
                                        : "대여 등록을 하려면 먼저 로그인해주세요."}
                                </Alert.Description>
                            </Alert.Content>
                        </Alert.Root>
                    )}
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
