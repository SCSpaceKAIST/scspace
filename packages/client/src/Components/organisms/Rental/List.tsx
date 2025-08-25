"use client"

import { Center, CheckboxCard, Grid, Separator, Stack } from "@chakra-ui/react";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import { useGoodsAPI } from "@scspace-client/Hooks/rental";
import { useEffect, useState } from "react";

export default function GoodsList(props: {
    refetchCount?: number;
    disabled?: boolean;
    isAdmin?: boolean;
}) {
    const refetchCount = props.refetchCount ?? 0;
    const disabled = props.disabled ?? false;
    const isAdmin = props.isAdmin ?? false;

    const [cart, setCart] = useState<{ id: number; count: number }[]>([]);
    const onCheckedChange = (c: { id: number; checked: boolean }) => {
        const exist = cart.find((item) => item.id === c.id);
        if (!exist && c.checked) {
            setCart((_cart) => [..._cart, { id: c.id, count: 1 }]);
        } else if (exist && !c.checked) {
            setCart((_cart) => _cart.filter((item) => item.id !== c.id));
        }
    }

    const [selectedId, setSelectedId] = useState<number>(-1);

    const {
        allGoods: {
            data: goodsListData,
            refetch: goodsListRefetch
        }
    } = useGoodsAPI();

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
            {goodsListData.map(object => (
                <CheckboxCard.Root
                    _hover={{
                        backgroundColor: "white"
                    }}
                    key={object.id}
                    checked={cart.find(c => c.id === object.id) ? true : false}
                    onCheckedChange={(v) => {
                        console.log(v);
                        const checked = !!v.checked;
                        setSelectedId(checked ? object.id : -1);
                        onCheckedChange({ id: object.id, checked });
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
                                {!disabled && <CheckboxCard.Indicator />}
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
        </Stack >
    );
}
