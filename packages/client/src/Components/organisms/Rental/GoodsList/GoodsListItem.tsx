"use client"

import { Box, Button, CheckboxCard, CloseButton, Collapsible, Dialog, Flex, Grid, Separator, Stack } from "@chakra-ui/react";
import { IGoods, IRentalCreateClient } from "@scspace-depot/types/rental";
import Image from "next/image";
import { useState } from "react";
import Counter from "./Counter";
import { useRentalAPI } from "@scspace-client/Hooks/rental";
import { toaster } from "@scspace-client/Components/atoms/Toaster";

export default function GoodsListItem({
    item,
    isSelected,
    onSelect,
    disabled,
    manage,
    isWide,
    refetch,
    countAvailable
}: {
    item: IGoods;
    isSelected: boolean;
    onSelect: (id: number) => void;
    disabled: boolean;
    manage: boolean;
    isWide: boolean;
    refetch: () => void;
    countAvailable: number;
}) {
    const [count, setCount] = useState<number>(1);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const { createRental } = useRentalAPI();

    const handleCreate = () => {
        const data: IRentalCreateClient = {
            goodsId: item.id,
            count: count
        };

        toaster.promise(
            createRental(data, {
                onError: (error) => {
                    setErrorMessage(error.message || 'Failed to create rental');
                    console.error('Failed to create rental:', error);
                },
                onSuccess: () => {
                    onSelect(item.id);
                    refetch();
                }
            }),
            {
                loading: {
                    title: "Creating rental...",
                    description: "Please wait",
                },
                success: {
                    title: "Rental created successfully!",
                    description: "The rental has been created",
                },
                error: {
                    title: "Failed to create rental",
                    description: errorMessage || "Please try again"
                }
            }
        );
    }

    const [imgOpen, setImgOpen] = useState(false);

    return (
        <>
            <Dialog.Root
                open={imgOpen && isWide}
                onOpenChange={(v) => setImgOpen(v.open)}
                size="cover"
                placement={"center"}
            >
                <Dialog.Backdrop zIndex={1500} />
                <Dialog.Positioner zIndex={1600}>
                    <Dialog.Content>
                        <Dialog.CloseTrigger asChild zIndex={1700}>
                            <CloseButton />
                        </Dialog.CloseTrigger>
                        <Dialog.Body p={2}>
                            <Box
                                position="relative"
                                h={"full"}
                                w={"full"}
                            >
                                <Image
                                    src={"http://localhost:3001" + (item.imageURI || "/img/logo.svg")}
                                    alt="LOGO"
                                    fill
                                    objectFit="contain"
                                />
                            </Box>
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
            <CheckboxCard.Root
                _hover={{
                    backgroundColor: "white"
                }}
                key={item.id}
                checked={isSelected}
                onCheckedChange={(v) => {
                    onSelect(item.id);
                }}
            >
                {!disabled && <CheckboxCard.HiddenInput />}
                <Stack gap={0}>
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
                                onClick={() => setImgOpen(true)}
                                cursor={"pointer"}
                            >
                                <Image
                                    src={"http://localhost:3001" + (item.imageURI || "/img/logo.svg")}
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
                                        {item.name}
                                    </CheckboxCard.Label>
                                    <CheckboxCard.Description>
                                        {item.countNow} / {item.countAll} Available
                                    </CheckboxCard.Description>
                                </CheckboxCard.Content>
                            </CheckboxCard.Control>
                            {(item.description !== null) && (
                                <CheckboxCard.Addon>
                                    {item.description}
                                </CheckboxCard.Addon>
                            )}
                        </Stack>
                    </Grid>
                    <Collapsible.Root open={isSelected && !manage}>
                        <Collapsible.Content>
                            <Separator />
                            <Flex justify={"flex-end"} p={2} gap={4}>
                                <Counter
                                    count={count}
                                    setCount={setCount}
                                    max={countAvailable}
                                />
                                <Button size={"sm"} colorPalette={"blue"} onClick={handleCreate}>
                                    Confirm
                                </Button>
                            </Flex>
                        </Collapsible.Content>
                    </Collapsible.Root>
                </Stack>
            </CheckboxCard.Root>
        </>
    );
}