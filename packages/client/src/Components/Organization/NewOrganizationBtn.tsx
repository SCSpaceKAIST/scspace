"use client"

import { Button, Dialog, Portal, IconButton, useBreakpointValue, } from "@chakra-ui/react";
import { useState, useRef } from "react";
import { useOrganizationAPI, } from "@scspace-client/Hooks/organization";
import InputComponent from "../Reservation/forms/utils/Input";
import { HiPlus } from "react-icons/hi2";

export default function NewOrganizationBtn({ uid, onSuccess }: {
    uid: number | null;
    onSuccess: () => any;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);
    const generateOrganization = useOrganizationAPI().createOrg;

    const isWide = useBreakpointValue({ base: false, md: true });

    return (
        <Dialog.Root
            initialFocusEl={() => inputRef.current}
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
            onExitComplete={() => setName("")}
            size={isWide ? "md" : "full"}
        >
            <Dialog.Trigger asChild>
                <IconButton
                    variant="outline"
                    rounded="sm"
                >
                    <HiPlus />
                </IconButton>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>
                                Make New Organization
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body pb="4">
                            <InputComponent
                                label="Organization Name"
                                placeholder="Input Name"
                                ref={inputRef}
                                value={name}
                                setValue={setName}
                            />
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline" rounded="sm">
                                    Cancel
                                </Button>
                            </Dialog.ActionTrigger>
                            <Dialog.ActionTrigger asChild>
                                <Button
                                    rounded="sm"
                                    onClick={() => {
                                        if (name && uid) {
                                            setOpen(false);
                                            generateOrganization({
                                                verificationStatus: 1,
                                                hasRoom: false,
                                                name: name,
                                                delegatorId: uid
                                            }, {
                                                onSuccess: () => onSuccess()
                                            });
                                        }
                                    }}
                                >
                                    Generate
                                </Button>
                            </Dialog.ActionTrigger>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}