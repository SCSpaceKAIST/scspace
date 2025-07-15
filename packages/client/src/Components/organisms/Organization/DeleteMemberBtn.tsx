"use client"

import {
    Button,
    Dialog,
    Portal,
    IconButton,
} from "@chakra-ui/react";
import { useState, } from "react";
import { useOrganizationAPI, } from "@scspace-client/Hooks/organization";
import { HiMiniXMark, } from "react-icons/hi2";

export default function DeleteMemberBtn({ onDelete, disabled, id, uid }: {
    onDelete: () => any;
    disabled: boolean;
    id: number;
    uid: number;
}) {
    const deleteOrganizationMember = useOrganizationAPI({ id }).deleteMember
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Dialog.Root
            role="alertdialog"
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
            placement="center"
        >
            <Dialog.Trigger asChild>
                <IconButton
                    variant="outline"
                    rounded="sm"
                    disabled={!disabled}
                    size="xs"
                >
                    <HiMiniXMark />
                </IconButton>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop zIndex={1500} />
                <Dialog.Positioner zIndex={1600}>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Are you sure?</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            This action cannot be undone. This will permanently delete member in yout organization.
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button
                                colorPalette="red"
                                rounded="sm"
                                onClick={() => deleteOrganizationMember({
                                    userId: uid
                                }, {
                                    onSuccess: () => {
                                        onDelete();
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