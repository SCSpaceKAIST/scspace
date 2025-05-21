
"use client"

import { Button, Dialog, Portal, } from "@chakra-ui/react";
import { useState, } from "react";
import { useOrganizationAPI, } from "@scspace-client/Hooks/organization";

export default function DeleteBtn({ id, onSuccess }: {
    id: number;
    onSuccess: () => any;
}) {
    const deleteOrganization = useOrganizationAPI({ id }).deleteOrg
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Dialog.Root
            role="alertdialog"
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
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our systems.
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button
                                colorPalette="red"
                                rounded="sm"
                                onClick={() => deleteOrganization({}, {
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