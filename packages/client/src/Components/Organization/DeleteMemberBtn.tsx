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
    const deleteOrganizationMember = useOrganizationAPI({ id }).removeMember
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Dialog.Root
            role="alertdialog"
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
        >
            <Dialog.Trigger asChild>
                <IconButton
                    variant="outline"
                    rounded="sm"
                    width="fit-content"
                    height="fit-content"
                    disabled={!disabled}
                >
                    <HiMiniXMark />
                </IconButton>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
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