// atoms/DeleteBtn.tsx

"use client"

import { Button, Dialog, Portal, } from "@chakra-ui/react";
import { useState, } from "react";

export default function DeleteBtn({ onDelete }: {
    onDelete: () => any
}) {
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
                            This action is permanent and cannot be undone.
                            The data will be completely removed from our systems.
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button
                                colorPalette="red"
                                rounded="sm"
                                onClick={() => {
                                    onDelete();
                                    setOpen(false);
                                }}
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