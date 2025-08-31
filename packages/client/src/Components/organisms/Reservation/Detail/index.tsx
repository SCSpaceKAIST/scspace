"use client"

import { Dialog, Portal, HStack, useBreakpointValue, DataList, Separator, Text, Button, Center, Stack, Badge } from "@chakra-ui/react";
import { useAuth } from "@scspace-client/Hooks/auth";
import { useDate } from "@scspace-client/Hooks/utils";
import { IReservationAll } from "@scspace-depot/types/reservation";
import { Dispatch, SetStateAction, useState } from "react";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import { UserTypeEnum } from "@scspace-depot/enums/user.enum";
import { useReservationAPI } from "@scspace-client/Hooks/reservation";
import DeleteBtn from "@scspace-client/Components/molecules/buttons/DeleteBtn";
import SimpleDialog from "@scspace-client/Components/atoms/SimpleDialog";
import DataListItem from "@scspace-client/Components/atoms/DataListItem";
import ChangeTimeBtn from "./ChangeTimeBtn";
import { useOrganizationAPI } from "@scspace-client/Hooks/organization";
import { toaster } from "@scspace-client/Components/atoms/Toaster";

export default function ReservationDetail({ open, setOpen, selectedRes, refetch }: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    selectedRes: IReservationAll | null;
    refetch: () => any;
}) {
    const { getString } = useDate();
    const { userInfo, isManager } = useAuth();

    const { data: organizationDetail } = useOrganizationAPI({ id: selectedRes?.organizationId ?? 0 }).organizationDetail;

    const isMember = organizationDetail?.members.some(member => member.userId === userInfo?.id) ?? false;

    const [e, setError] = useState<string | null>(null);

    const deleteReservation = useReservationAPI({ rid: selectedRes?.id ?? 0 }).deleteRes;
    function onDelete() {
        toaster.promise(
            deleteReservation({}, {
                onError: (error) => {
                    setError(error.message);
                },
                onSuccess: () => {
                    refetch();
                    setOpen(false);
                }
            }),
            {
                loading: {
                    title: "Deleting...",
                    description: "Please wait",
                },
                success: {
                    title: "Deleted Successfully!",
                    description: "Your Reservation has been deleted",
                },
                error: {
                    title: "Delete Failed",
                    description: e ?? "Please resubmit"
                }
            }
        )
    }

    const isWide = useBreakpointValue<boolean>({ base: false, md: true });

    return (
        <SimpleDialog
            open={open}
            setOpen={setOpen}
        >
            {selectedRes ? (
                <>
                    <Dialog.Header>
                        <Dialog.Title>
                            {selectedRes.title}
                        </Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <DataList.Root orientation="horizontal" width="100%">
                            <DataListItem label="Description">
                                {selectedRes.content.description}
                            </DataListItem>
                            <Separator />
                            <DataListItem label="Create Time">
                                {getString(selectedRes.timePost)}
                            </DataListItem>
                            <DataListItem label="Update Time">
                                {getString(selectedRes.timeUpdate)}
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
                                <HStack>
                                    <Stack >
                                        <HStack>
                                            <Text color={"fg.muted"} fontSize="sm">F</Text>
                                            <Text>{getString(selectedRes.timeFrom)}</Text>
                                        </HStack>
                                        <HStack>
                                            <Text color={"fg.muted"} fontSize="sm">T</Text>
                                            <Text>{getString(selectedRes.timeTo)}</Text>
                                        </HStack>
                                    </Stack>
                                    {(isManager || isMember) && (
                                        <ChangeTimeBtn
                                            rid={selectedRes.id}
                                            refetch={refetch}
                                            timeFrom={selectedRes.timeFrom}
                                            timeTo={selectedRes.timeTo}
                                        />
                                    )}
                                </HStack>
                            </DataListItem>
                            <DataListItem label="Space">
                                {selectedRes.space.nameKr} ({selectedRes.space.nameEn})
                            </DataListItem>
                            {selectedRes.organizationId !== 1 && (
                                <DataListItem label="Organization">
                                    {selectedRes.organization.name}
                                </DataListItem>
                            )}
                            <DataListItem label="Booker">
                                <HStack>
                                    <Text>
                                        {selectedRes.user.nameKr}
                                    </Text>
                                    {(selectedRes.user.type === UserTypeEnum.ADMIN || selectedRes.user.type === UserTypeEnum.MANAGER) && (
                                        <Badge colorPalette={"blue"}>SCSpace</Badge>
                                    )}
                                </HStack>
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