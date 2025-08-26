"use client"

import { Center, CheckboxCard, Grid, Separator, Stack } from "@chakra-ui/react";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import { useGoodsAPI } from "@scspace-client/Hooks/rental";
import { useEffect, useState } from "react";
import ManageBar from "./ManageGoods/ManageBar";
import CartCollapsible from "./SelectGoods/CartCollapsible";

export interface ICartItem {
    id: number;
    name: string;
    count: number;
    countNow: number;
}

export default function GoodsList(props: {
    refetchCount?: number;
    disabled?: boolean;
    manage?: boolean;
}) {
    const refetchCount = props.refetchCount ?? 0;
    const disabled = props.disabled ?? false;
    const manage = props.manage ?? false;

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

    useEffect(() => {
        goodsListRefetch();
    }, [refetchCount]);

    const deleteGoods = useGoodsAPI().deleteGoods;

    const [errorMessage, setErrorMessage] = useState<string>('');
    const handleDelete = (id: number) => {
        toaster.promise(
            deleteGoods({}, {
                onSuccess: () => {
                    goodsListRefetch();
                },
                onError: (error) => {
                    setErrorMessage(error.message || 'Failed to create goods');
                    console.error('Failed to delete goods:', error);
                }
            }),
            {
                loading: {
                    title: "Deleting goods...",
                    description: "Please wait",
                },
                success: {
                    title: "Goods deleted successfully!",
                    description: "The goods has been removed",
                },
                error: {
                    title: "Failed to delete goods",
                    description: errorMessage || "Please try again"
                }
            }
        )
    }

    return (!goodsListData || goodsListData.length === 0) ? (
        <LoadingComponent />
    ) : (
        <Stack p={2}>
            {manage && (
                <ManageBar
                    item={cart[0] ?? null}
                    onChange={goodsListRefetch}
                />
            )}
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
                    <Grid templateColumns="auto auto 1fr">
                        <Center aspectRatio={5 / 4}>
                            image
                        </Center>
                        <Separator orientation="vertical" />
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
            {!manage && (
                <CartCollapsible
                    cart={cart}
                    setCart={setCart}
                />
            )}
        </Stack >
    );
}
