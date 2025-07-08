"use client"

import { Dialog, Portal, HStack, useBreakpointValue, DataList, Separator, Text, Button, Center } from "@chakra-ui/react";
import { useAuth } from "@scspace-client/Hooks/auth";
import { useDate } from "@scspace-client/Hooks/utils";
import { IReservationAll } from "@scspace-depot/types/reservation";
import { Dispatch, SetStateAction } from "react";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import { UserTypeEnum } from "@scspace-depot/enums/user.enum";
import { useReservationAPI } from "@scspace-client/Hooks/reservation";
import DeleteBtn from "@scspace-client/Components/molecules/buttons/DeleteBtn";
import SimpleDialog from "@scspace-client/Components/atoms/SimpleDialog";
import DataListItem from "@scspace-client/Components/atoms/DataListItem";

export default function CalendarDialog({ open, setOpen, selectedRes, refetch }: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    selectedRes: IReservationAll | null;
    refetch: () => any;
}) {
    const isWide = useBreakpointValue({ base: false, md: true });
    const { getString } = useDate();
    const { userInfo } = useAuth();

    const deleteReservation = useReservationAPI({ rid: selectedRes?.id ?? 0 }).deleteRes;
    function onDelete() {
        deleteReservation({}, {
            onSuccess: () => {
                refetch();
                setOpen(false);
            }
        });
    }

    return (
        <SimpleDialog
            open={open}
            setOpen={setOpen}
        >
            {selectedRes ? (
                <>
                    <Dialog.Header>
                        <HStack width="100%" justifyContent="space-between" alignItems="start">
                            <Dialog.Title whiteSpace="nowrap">
                                {selectedRes.title}
                            </Dialog.Title>
                            <DataList.Root orientation="horizontal" gap={1} color="fg.muted">
                                <DataListItem label="Create Time">
                                    {getString(selectedRes.timePost)}
                                </DataListItem>
                                <DataListItem label="Update Time">
                                    {getString(selectedRes.timeUpdate)}
                                </DataListItem>
                            </DataList.Root>
                        </HStack>
                    </Dialog.Header>
                    <Dialog.Body>
                        <DataList.Root orientation="horizontal" width="100%">
                            <DataListItem label="Description">
                                {selectedRes.content.description}
                            </DataListItem>
                            <Separator />
                            <DataListItem label="Content">
                                <DataList.Root orientation="horizontal" margin={0} >
                                    <DataListItem label="# of Insiders">
                                        {selectedRes.content.innerParticipantNumber}
                                    </DataListItem>
                                    <DataListItem label="# of Outsiders">
                                        {selectedRes.content.outerParticipantNumber}
                                    </DataListItem>
                                    <DataListItem label="Food Info">
                                        {(selectedRes.content.food === "") ? (
                                            <Text margin={0} padding={0} color="bg.emphasized">
                                                Did Not Entered
                                            </Text>
                                        ) : (selectedRes.content.food)}
                                    </DataListItem>
                                    <DataListItem label="# of Desk">
                                        {selectedRes.content.desk}
                                    </DataListItem>
                                    <DataListItem label="# of Chair">
                                        {selectedRes.content.chair}
                                    </DataListItem>
                                    <DataListItem label="# of Worker">
                                        {selectedRes.content.worker}
                                    </DataListItem>
                                    {(selectedRes.spaceId === 13) && (
                                        <DataListItem label="Busking Zone">
                                            {selectedRes.content.busking ? "Yes" : "No"}
                                        </DataListItem>
                                    )}
                                </DataList.Root>
                            </DataListItem>
                            <Separator />
                            <DataListItem label="Time">
                                {getString(selectedRes.timeFrom)} - {getString(selectedRes.timeTo)}
                            </DataListItem>
                            <DataListItem label="Space">
                                {selectedRes.space.nameKr} ({selectedRes.space.nameEn})
                            </DataListItem>
                            <DataListItem label="Booker">
                                {(selectedRes.organizationId === 1) ? (selectedRes.user.nameKr) : (selectedRes.organization.name)}
                            </DataListItem>
                        </DataList.Root>
                    </Dialog.Body>
                    <Dialog.Footer>
                        {userInfo && ((userInfo.id === selectedRes.userId) || (userInfo.type === UserTypeEnum.MANAGER) || (userInfo.type === UserTypeEnum.ADMIN)) && (
                            <DeleteBtn onDelete={onDelete} />
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
        </SimpleDialog >
    );
}