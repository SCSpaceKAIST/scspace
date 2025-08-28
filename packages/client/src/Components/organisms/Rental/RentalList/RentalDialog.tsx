"use client"

import {
    Button,
    Dialog,
    Separator,
    IconButton,
    DataList,
    HStack,
    useBreakpointValue,
    Badge,
} from "@chakra-ui/react";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import { HiOutlineRefresh } from "react-icons/hi";

import { useAuth } from "@scspace-client/Hooks/auth";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDate } from "@scspace-client/Hooks/utils";
import DeleteBtn from "@scspace-client/Components/molecules/buttons/DeleteBtn";
import DataListItem from "@scspace-client/Components/atoms/DataListItem";
import SimpleDialog from "@scspace-client/Components/atoms/SimpleDialog";
import { IRentalAll } from "@scspace-depot/types/rental";

export default function RentalDialog({ open, setOpen, rental, refetchList }: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    rental: IRentalAll | null;
    refetchList: () => any;
}) {
    const { userInfo, isManager } = useAuth();
    const { getString } = useDate();

    const isWide = useBreakpointValue({ base: false, md: true });

    return (
        <SimpleDialog
            open={open}
            setOpen={setOpen}
        >
            {rental ? (
                <>
                    <Dialog.Header>
                        <HStack>
                            <IconButton rounded="sm" variant="ghost" onClick={() => refetchList()} size="sm">
                                <HiOutlineRefresh color="gray" />
                            </IconButton>
                            <Dialog.Title>
                                {rental.goods.name} {"x"} {rental.count}
                            </Dialog.Title>
                        </HStack>
                    </Dialog.Header>
                    <Separator />
                    <Dialog.Body px={8} py={4}>
                        <DataList.Root orientation={isWide ? "horizontal" : "vertical"}>
                            {/* {isManager && (
                                <>
                                    <Verification
                                        organization={organizationDetail}
                                        onChange={() => {
                                            refetchDetail();
                                            refetchList();
                                        }}
                                    />
                                    <Separator />
                                </>
                            )} */}
                            <DataListItem label="Goods">
                                <DataList.Root
                                    orientation={isWide ? "horizontal" : "vertical"}
                                    gap={1} color="fg.muted"
                                >
                                    <DataListItem label="Name">
                                        {rental.goods.name}
                                    </DataListItem>
                                    <DataListItem label="Description">
                                        {rental.goods.description}
                                    </DataListItem>
                                    <DataListItem label="# of rentals">
                                        {rental.count}
                                    </DataListItem>
                                </DataList.Root>
                            </DataListItem>
                            <DataListItem label="Info">
                                <DataList.Root
                                    orientation={isWide ? "horizontal" : "vertical"}
                                    gap={1} color="fg.muted"
                                >
                                    <DataListItem label="Burrowed Time">
                                        {getString(rental.timeBorrow)}
                                    </DataListItem>
                                    <DataListItem label="Return Due">
                                        {getString(rental.timeDue)}
                                    </DataListItem>
                                    <DataListItem label="Returned Time">
                                        {rental.timeReturn === 0 ? (<Badge>Not Returned</Badge>) : getString(rental.timeReturn)}
                                    </DataListItem>
                                    <DataListItem label="Confirm Time">
                                        {rental.timeConfirm === 0 ? (<Badge>Not Confirmed</Badge>) : getString(rental.timeConfirm)}
                                    </DataListItem>
                                </DataList.Root>
                            </DataListItem>
                            <DataListItem label="User">
                                <DataList.Root
                                    orientation={isWide ? "horizontal" : "vertical"}
                                    gap={1} color="fg.muted"
                                >
                                    <DataListItem label="Name">
                                        {rental.user.nameKr} ({rental.user.nameEn})
                                    </DataListItem>
                                    <DataListItem label="Student Number">
                                        {rental.user.studentNumber}
                                    </DataListItem>
                                    <DataListItem label="Email">
                                        {rental.user.email}
                                    </DataListItem>
                                </DataList.Root>
                            </DataListItem>
                        </DataList.Root>
                    </Dialog.Body >
                    <Separator />
                    <Dialog.Footer>
                        <Dialog.ActionTrigger asChild>
                            <Button variant="outline" rounded="sm">
                                Close
                            </Button>
                        </Dialog.ActionTrigger>
                    </Dialog.Footer>
                </>
            ) : (<LoadingComponent />)}
        </SimpleDialog >
    );
}