"use client"

import { Dialog, Portal, HStack, useBreakpointValue, DataList, Separator, Text, Button, Center } from "@chakra-ui/react";
import { useAuth } from "@scspace-client/Hooks/auth";
import { useDate } from "@scspace-client/Hooks/utils";
import { IReservationAll } from "@scspace-depot/types/reservation";
import { Dispatch, SetStateAction } from "react";
import DeleteBtn from "./DeleteBtn";
import LoadingComponent from "../../atoms/Loading";
import { UserTypeEnum } from "@scspace-depot/enums/user.enum";

export default function CalendarDialog({ open, setOpen, selectedRes, refetch }: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    selectedRes: IReservationAll | null;
    refetch: () => any;
}) {
    const isWide = useBreakpointValue({ base: false, md: true });
    const { getString } = useDate();
    const { userInfo } = useAuth();
    function onDeleteSuccess() {
        refetch();
        setOpen(false);
    }

    return (
        <Dialog.Root
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
            size={isWide ? "cover" : "full"}
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content className={isWide ? "" : "full"}>
                        {selectedRes ? (
                            <>
                                <Dialog.Header>
                                    <HStack width="100%" justifyContent="space-between" alignItems="start">
                                        <Dialog.Title whiteSpace="nowrap">
                                            {selectedRes.title}
                                        </Dialog.Title>
                                        <DataList.Root orientation="horizontal" gap={1} color="fg.muted">
                                            <DataList.Item gap={0}>
                                                <DataList.ItemLabel>
                                                    Create Time
                                                </DataList.ItemLabel>
                                                <DataList.ItemValue margin={0}>
                                                    {getString(selectedRes.timePost)}
                                                </DataList.ItemValue>
                                            </DataList.Item>
                                            <DataList.Item gap={0}>
                                                <DataList.ItemLabel>
                                                    Update Time
                                                </DataList.ItemLabel>
                                                <DataList.ItemValue margin={0}>
                                                    {getString(selectedRes.timeUpdate)}
                                                </DataList.ItemValue>
                                            </DataList.Item>
                                        </DataList.Root>
                                    </HStack>
                                </Dialog.Header>
                                <Dialog.Body>
                                    <DataList.Root orientation="horizontal" width="100%">
                                        <DataList.Item gap={0}>
                                            <DataList.ItemLabel>
                                                Description
                                            </DataList.ItemLabel>
                                            <DataList.ItemValue margin={0}>
                                                {selectedRes.content.description}
                                            </DataList.ItemValue>
                                        </DataList.Item>
                                        <Separator />
                                        <DataList.Item gap={0} alignItems="start">
                                            <DataList.ItemLabel>
                                                Content
                                            </DataList.ItemLabel>
                                            <DataList.ItemValue margin={0} >
                                                <DataList.Root orientation="horizontal" margin={0} >
                                                    <DataList.Item gap={0}>
                                                        <DataList.ItemLabel>
                                                            # of Internal
                                                        </DataList.ItemLabel>
                                                        <DataList.ItemValue margin={0} >
                                                            {selectedRes.content.innerParticipantNumber}
                                                        </DataList.ItemValue>
                                                    </DataList.Item>
                                                    <DataList.Item gap={0}>
                                                        <DataList.ItemLabel>
                                                            # of External
                                                        </DataList.ItemLabel>
                                                        <DataList.ItemValue margin={0} >
                                                            {selectedRes.content.outerParticipantNumber}
                                                        </DataList.ItemValue>
                                                    </DataList.Item>
                                                    <DataList.Item gap={0}>
                                                        <DataList.ItemLabel>
                                                            Food Info
                                                        </DataList.ItemLabel>
                                                        <DataList.ItemValue margin={0}>
                                                            {(selectedRes.content.food === "") ? (
                                                                <Text margin={0} padding={0} color="bg.emphasized">
                                                                    Did Not Entered
                                                                </Text>
                                                            ) : (selectedRes.content.food)}
                                                        </DataList.ItemValue>
                                                    </DataList.Item>
                                                    <DataList.Item gap={0}>
                                                        <DataList.ItemLabel>
                                                            # of Desk
                                                        </DataList.ItemLabel>
                                                        <DataList.ItemValue margin={0} >
                                                            {selectedRes.content.desk}
                                                        </DataList.ItemValue>
                                                    </DataList.Item>
                                                    <DataList.Item gap={0}>
                                                        <DataList.ItemLabel>
                                                            # of Chair
                                                        </DataList.ItemLabel>
                                                        <DataList.ItemValue margin={0} >
                                                            {selectedRes.content.chair}
                                                        </DataList.ItemValue>
                                                    </DataList.Item>
                                                    <DataList.Item gap={0}>
                                                        <DataList.ItemLabel>
                                                            # of Worker
                                                        </DataList.ItemLabel>
                                                        <DataList.ItemValue margin={0} >
                                                            {selectedRes.content.worker}
                                                        </DataList.ItemValue>
                                                    </DataList.Item>
                                                    {(selectedRes.spaceId === 13) && (
                                                        <DataList.Item gap={0}>
                                                            <DataList.ItemLabel>
                                                                Busking Zone
                                                            </DataList.ItemLabel>
                                                            <DataList.ItemValue margin={0} >
                                                                {selectedRes.content.busking ? "Yes" : "No"}
                                                            </DataList.ItemValue>
                                                        </DataList.Item>
                                                    )}
                                                </DataList.Root>
                                            </DataList.ItemValue>
                                        </DataList.Item>
                                        <Separator />
                                        <DataList.Item gap={0}>
                                            <DataList.ItemLabel>
                                                Time
                                            </DataList.ItemLabel>
                                            <DataList.ItemValue margin={0} >
                                                {getString(selectedRes.timeFrom)} - {getString(selectedRes.timeTo)}
                                            </DataList.ItemValue>
                                        </DataList.Item>
                                        <DataList.Item gap={0}>
                                            <DataList.ItemLabel>
                                                Space
                                            </DataList.ItemLabel>
                                            <DataList.ItemValue margin={0} >
                                                {selectedRes.space.nameKr} ({selectedRes.space.nameEn})
                                            </DataList.ItemValue>
                                        </DataList.Item>
                                        <DataList.Item gap={0}>
                                            <DataList.ItemLabel>
                                                Booker
                                            </DataList.ItemLabel>
                                            <DataList.ItemValue margin={0} >
                                                {(selectedRes.organizationId === 1) ? (
                                                    selectedRes.user.nameKr
                                                ) : (
                                                    selectedRes.organization.name
                                                )}
                                            </DataList.ItemValue>
                                        </DataList.Item>
                                    </DataList.Root>
                                </Dialog.Body>
                                <Dialog.Footer>
                                    {userInfo && ((userInfo.id === selectedRes.userId) || (userInfo.type === UserTypeEnum.MANAGER) || (userInfo.type === UserTypeEnum.ADMIN)) && (
                                        <DeleteBtn rid={selectedRes.id} onSuccess={onDeleteSuccess} />
                                    )}
                                    <Dialog.ActionTrigger asChild>
                                        <Button variant="outline" rounded="sm">
                                            Close
                                        </Button>
                                    </Dialog.ActionTrigger>
                                </Dialog.Footer>
                            </>
                        ) : (
                            <Center margin={8}>
                                <LoadingComponent />
                            </Center>
                        )}
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root >
    );
}