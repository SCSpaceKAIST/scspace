"use client"

import { Center, CheckboxCard, Grid, Separator, Stack } from "@chakra-ui/react";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import { useGoodsAPI } from "@scspace-client/Hooks/rental";

export default function GoodsList(props: {
    checked?: { [key: string]: boolean },
    onCheckedChange?: (prop: { id: number, checked: boolean }) => void
}) {
    const checked = props.checked ?? {};
    const onCheckedChange = props.onCheckedChange ?? (() => { });

    const {
        allGoods: {
            data: goodsListData,
            isLoading: goodsListLoading,
            refetch: goodsListRefetch
        }
    } = useGoodsAPI();

    return (!goodsListData || goodsListData.length === 0) ? (
        <LoadingComponent />
    ) : (
        <Stack p={2}>
            {goodsListData.map(object => (
                <CheckboxCard.Root
                    key={object.id}
                    checked={checked[object.id.toString()] ?? false}
                    onCheckedChange={(v) =>
                        onCheckedChange({ id: object.id, checked: !!v.checked })
                    }
                >
                    <CheckboxCard.HiddenInput />
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
                                <CheckboxCard.Indicator />
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
