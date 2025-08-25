"use client"

import { Center, CheckboxCard, Grid, Separator, Stack } from "@chakra-ui/react";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import { useGoodsAPI } from "@scspace-client/Hooks/rental";
import { useEffect, useState } from "react";

export default function GoodsList(props: {
    checked?: { [key: string]: boolean };
    onCheckedChange?: (prop: { id: number, checked: boolean }) => void;
    refetchCount?: number;
}) {
    const refetchCount = props.refetchCount ?? 0;
    const disabled = props.onCheckedChange === undefined ? true : false;
    const checked = props.checked ?? {};
    const onCheckedChange = props.onCheckedChange ?? (() => { });

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
                    checked={checked[object.id.toString()] ?? false}
                    onCheckedChange={(v) => {
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
