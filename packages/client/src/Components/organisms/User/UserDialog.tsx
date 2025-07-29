"use client"

import { Dialog, DataList, Separator, Button, Center, useBreakpointValue, Stack } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import { IUser } from "@scspace-depot/types/user";
import { useUserAPI } from "@scspace-client/Hooks/user";
import SimpleDialog from "@scspace-client/Components/atoms/SimpleDialog";
import DataListItem from "@scspace-client/Components/atoms/DataListItem";
import UpdateType from "./UpdateType";
import { useOrganization } from "@scspace-client/Hooks/organization";
import OrganizationTable from "../Organization/OrganizationTable";
import { useUserReservation } from "@scspace-client/Hooks/reservation";
import { IReservationAll } from "@scspace-depot/types/reservation";
import ReservationDetail from "../Reservation/Detail";
import SimpleTable from "@scspace-client/Components/atoms/SimpleTable";
import { useDate } from "@scspace-client/Hooks/utils";
import SimplePagination from "@scspace-client/Components/molecules/page/SimplePagenation";

export default function UserDialog({
    open: openDetail,
    setOpen: setOpenDetail,
    user,
    refetchList
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    user: IUser | null;
    refetchList: () => any;
}) {
    const { getUserTypeCode } = useUserAPI({ uid: user?.id ?? 0 });
    const { organization, refetch: refetchOrg } = useOrganization({ uid: user?.id ?? 0 });
    const isWide = useBreakpointValue({ base: false, md: true });

    const [page, setPage] = useState<number>(1);
    const [openResDetail, setOpenResDetail] = useState<boolean>(false);
    const { reservation, refetch: refetchRes } = useUserReservation({
        uid: user?.id || 0,
        oid: 0,
        limit: 50,
        offset: 50 * (page - 1)
    });
    const [selectedRes, setSelectedRes] = useState<IReservationAll | null>(null);
    useEffect(() => { refetchRes(); }, [page, user?.id || 0]);
    useEffect(() => { setSelectedRes(reservation.data[0] || null); }, [reservation]);

    const { getString } = useDate();

    return (<>
        <ReservationDetail
            open={openResDetail}
            setOpen={setOpenResDetail}
            selectedRes={selectedRes}
            refetch={refetchRes}
        />
        <SimpleDialog
            open={openDetail}
            setOpen={setOpenDetail}
        >
            {user ? (
                <>
                    <Dialog.Header>
                        <Dialog.Title whiteSpace="nowrap">
                            {user.nameKr}
                        </Dialog.Title>
                    </Dialog.Header>
                    <Separator />
                    <Dialog.Body>
                        <UpdateType uid={user.id} onChange={refetchList} />
                        <Separator my={4} />
                        <DataList.Root orientation={isWide ? "horizontal" : "vertical"} width="100%">
                            <DataListItem label="Eng Name">
                                {user.nameEn}
                            </DataListItem>
                            <DataListItem label="Student Number">
                                {user.studentNumber}
                            </DataListItem>
                            <DataListItem label="Email">
                                {user.email}
                            </DataListItem>
                            <DataListItem label="Type">
                                {getUserTypeCode(user.type)}
                            </DataListItem>
                            <Separator />
                            <DataListItem label="Organization">
                                {organization ? (
                                    <OrganizationTable
                                        organization={organization}
                                        refetch={refetchOrg}
                                    />
                                ) : (
                                    <LoadingComponent />
                                )}
                            </DataListItem>
                            <Separator />
                            <DataListItem label="Reservation">
                                <Stack>
                                    <SimpleTable
                                        onIdChange={(id) => {
                                            const res = reservation.data.find((r) => r.id === id);
                                            if (res) {
                                                setSelectedRes(res);
                                                setOpenResDetail(true);
                                            }
                                        }}
                                        header={["Title", "Booker", "From", "To"]}
                                        content={reservation.data.map((r) => ({
                                            id: r.id,
                                            row: [
                                                r.title,
                                                r.organizationId !== 1 ? r.organization.name : r.user.nameKr,
                                                getString(r.timeFrom),
                                                getString(r.timeTo)
                                            ]
                                        }))}
                                    />
                                    <Center width="100%">
                                        <SimplePagination
                                            count={reservation.count}
                                            pageSize={50}
                                            page={page}
                                            onPageChange={({ page }) => setPage(page)}
                                        />
                                    </Center>
                                </Stack>
                            </DataListItem>
                        </DataList.Root>
                    </Dialog.Body>
                    <Dialog.Footer>
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
        </SimpleDialog>
    </>);
}