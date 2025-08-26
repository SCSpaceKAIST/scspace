"use client"

import { Box, Center, CheckboxCard, Grid, Separator, Stack, useBreakpointValue } from "@chakra-ui/react";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import { useGoodsAPI } from "@scspace-client/Hooks/rental";
import { useState } from "react";
import ManageBar from "./ManageGoods/ManageBar";
import CartCollapsible from "./ManageCart/CartCollapsible";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import Image from "next/image";

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

    const [cart, setCart] = useState<ICartItem[]>([]);
    const onCheckedChange = (c: {
        name: string;
        id: number;
        checked: boolean;
        countNow: number;
    }) => {
        const exist = cart.find((item) => item.id === c.id);
        if (!manage) {
            if (!exist && c.checked) {
                setCart((_cart) => [..._cart, {
                    id: c.id,
                    count: 1,
                    name: c.name,
                    countNow: c.countNow
                }]);
            } else if (exist && !c.checked) {
                setCart((_cart) => _cart.filter((item) => item.id !== c.id));
            }
        } else {
            if (!exist && c.checked) {
                setCart([{
                    id: c.id,
                    count: 1,
                    name: c.name,
                    countNow: c.countNow
                }]);
            } else if (exist && !c.checked) {
                setCart([]);
            }
        }
    }

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
                item={cart[0] ?? null}
                onChange={goodsListRefetch}
            />
        )}
        <Grid templateRows={"1fr auto"} height={"100%"}>
            <Scroll>
                <Stack p={2}>

                    {goodsListData.map(object => (
                        <CheckboxCard.Root
                            _hover={{
                                backgroundColor: "white"
                            }}
                            key={object.id}
                            checked={cart.find(c => c.id === object.id) ? true : false}
                            onCheckedChange={(v) => {
                                onCheckedChange({
                                    id: object.id,
                                    checked: !!v.checked,
                                    name: object.name,
                                    countNow: object.countNow
                                });
                            }}
                        >
                            {!disabled && <CheckboxCard.HiddenInput />}
                            <Grid
                                templateColumns={isWide ? "auto auto 1fr" : "1fr"}
                                templateRows={isWide ? "1fr" : "auto auto 1fr "}
                            >
                                <Box
                                    aspectRatio={5 / 4}
                                    p={2}
                                >
                                    <Box
                                        position="relative"
                                        h={"full"}
                                        w={"full"}
                                    >
                                        <Image
                                            src="/img/logo.svg"
                                            alt="LOGO"
                                            fill
                                            objectFit="contain"
                                        />
                                    </Box>
                                </Box>
                                <Separator orientation={isWide ? "vertical" : "horizontal"} />
                                <Stack gap={0}>
                                    <CheckboxCard.Control>
                                        <CheckboxCard.Content>
                                            <CheckboxCard.Label>
                                                {object.name}
                                            </CheckboxCard.Label>
                                            <CheckboxCard.Description>
                                                {object.countNow} / {object.countAll} Available
                                            </CheckboxCard.Description>
                                        </CheckboxCard.Content>
                                        {(!disabled && !manage) && <CheckboxCard.Indicator />}
                                    </CheckboxCard.Control>
                                    {(object.description !== null) && (
                                        <CheckboxCard.Addon>
                                            {object.description}
                                        </CheckboxCard.Addon>
                                    )}
                                </Stack>
                            </Grid>
                        </CheckboxCard.Root>
                    ))}
                </Stack>
            </Scroll>
            {(!manage && !disabled) && (
                <CartCollapsible
                    cart={cart}
                    setCart={setCart}
                />
            )}
        </Grid>
    </>);
}
