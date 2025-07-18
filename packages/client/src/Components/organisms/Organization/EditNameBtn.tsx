"use client";

import { Dialog, DialogBackdrop, Button, Portal, Text, IconButton } from "@chakra-ui/react";
import TooltipComponent from "@scspace-client/Components/atoms/Tooptip";
import InputComponent from "@scspace-client/Components/molecules/forms/Input";
import { useOrganizationAPI } from "@scspace-client/Hooks/organization";
import { useState } from "react";
import { HiOutlinePencilAlt } from "react-icons/hi";

export default function EditNameBtn({ oid, refetch, name }: {
    oid: number;
    name: string;
    refetch: () => any;
}) {
    const updateOrg = useOrganizationAPI({ id: oid }).updateOrg;
    const [newName, setNewName] = useState<string>(name);

    return (
        <Dialog.Root
            role="alertdialog"
            placement="center"
        >
            <TooltipComponent content="Edit Name">
                <Dialog.Trigger asChild>
                    <IconButton size="sm" variant="outline" rounded="sm">
                        <HiOutlinePencilAlt />
                    </IconButton>
                </Dialog.Trigger>
            </TooltipComponent>
            <Portal>
                <DialogBackdrop zIndex={1500} />
                <Dialog.Positioner zIndex={1600}>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>
                                Edit Organization Name
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <InputComponent
                                label="Update Organization Name"
                                value={newName}
                                onChange={(v) => setNewName(v)}
                                placeholder="Enter new name of the organization"
                                errortext={!newName ? "Name cannot be empty" : ""}
                            />
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button colorPalette="blue" rounded="sm"
                                    onClick={() => updateOrg({}, {
                                        onSuccess: () => {
                                            alert("Update name successfully.");
                                            refetch();
                                        }
                                    })}
                                >
                                    Update
                                </Button>
                            </Dialog.ActionTrigger>
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