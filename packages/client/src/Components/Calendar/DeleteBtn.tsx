"use client"

import { Button, Dialog, Portal, } from "@chakra-ui/react";
import { useReservationAPI } from "@scspace-client/Hooks/reservation";
import { useState, } from "react";

export default function DeleteBtn({ rid, onSuccess }: {
    rid: number;
    onSuccess: () => any;
}) {
    const deleteReservation = useReservationAPI({ rid }).deleteRes
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Dialog.Root
            role="alertdialog"
            placement="center"
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
        >
            <Dialog.Trigger asChild>
                <Button colorPalette="red" rounded="sm">
                    Delete
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop zIndex={1500} />
                <Dialog.Positioner zIndex={1600}>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Are you sure?</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            This action cannot be undone.
                            This will permanently delete this reservation and remove data from our systems.
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button
                                colorPalette="red"
                                rounded="sm"
                                onClick={() => deleteReservation({}, {
                                    onSuccess: () => {
                                        onSuccess();
                                        setOpen(false);
                                    }
                                })}
                            >
                                Delete
                            </Button>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline" rounded="sm">
                                    Cancel
                                </Button>
                            </Dialog.ActionTrigger>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root >
    );
}