"use client"

import { Box, Button, CheckboxCard, CloseButton, Collapsible, Dialog, Flex, Grid, Separator, Stack } from "@chakra-ui/react";
import { IGoods } from "@scspace-depot/types/rental";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@scspace-client/Hooks/auth";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import RentalCreateDialog from "./RentalCreateDialog";

const localhostBaseURL = "http://localhost:3001";

export default function GoodsListItem({
    item,
    isSelected,
    onSelectAction,
    disabled,
    manage,
    isWide,
    refetchAction,
    countAvailable
}: {
    item: IGoods;
    isSelected: boolean;
    onSelectAction: (id: number) => void;
    disabled: boolean;
    manage: boolean;
    isWide: boolean;
    refetchAction: () => void;
    countAvailable: number;
}) {
    const { userInfo } = useAuth();

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
                                    src={item.imageURI ? `${localhostBaseURL}${item.imageURI}` : "/img/logo.svg"}
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
                onCheckedChange={() => {
                    onSelectAction(item.id);
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
                                    src={item.imageURI ? `${localhostBaseURL}${item.imageURI}` : "/img/logo.svg"}
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
                                {userInfo?.id ? (
                                    <RentalCreateDialog
                                        item={item}
                                        refetchAction={refetchAction}
                                        countAvailable={countAvailable}
                                    />
                                ) : (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            toaster.error({
                                                title: "로그인이 필요합니다",
                                                description: "대여 신청을 하려면 먼저 로그인해주세요"
                                            });
                                        }}
                                    >
                                        대여 신청
                                    </Button>
                                )}
                            </Flex>
                        </Collapsible.Content>
                    </Collapsible.Root>
                </Stack>
            </CheckboxCard.Root>
        </>
    );
}
