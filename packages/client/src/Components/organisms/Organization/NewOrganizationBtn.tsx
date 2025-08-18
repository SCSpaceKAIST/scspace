"use client"

import { Button, Dialog, Portal, IconButton, useBreakpointValue, } from "@chakra-ui/react";
import { useState, useRef } from "react";
import { useOrganizationAPI, } from "@scspace-client/Hooks/organization";
import InputComponent from "../../molecules/forms/Input";
import { HiPlus } from "react-icons/hi2";
import TooltipComponent from "@scspace-client/Components/atoms/Tooptip";
import NewOrganizationNotice from "./NewOrganizationNotice";
import { useMailAPI } from "@scspace-client/Hooks/mail";

export default function NewOrganizationBtn({ uid, onSuccess }: {
    uid: number | null;
    onSuccess: () => any;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);
    const generateOrganization = useOrganizationAPI().createOrg;

    const isWide = useBreakpointValue({ base: false, md: true });

    const sendMail = useMailAPI().sendMail;

    return (
        <Dialog.Root
            initialFocusEl={() => inputRef.current}
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
            onExitComplete={() => setName("")}
            size={isWide ? "lg" : "full"}
        >
            <TooltipComponent content="Add new organization">
                <Dialog.Trigger asChild>
                    <IconButton
                        variant="outline"
                        rounded="sm"
                    >
                        <HiPlus />
                    </IconButton>
                </Dialog.Trigger>
            </TooltipComponent>
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
                                onChange={setName}
                            />
                            <NewOrganizationNotice />
                            <InputComponent
                                label="Organization Description"
                                placeholder="Input Description"
                                value={description}
                                onChange={setDescription}
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
                                    disabled={!name || !description || !uid}
                                    rounded="sm"
                                    onClick={() => {
                                        if (name && uid) {
                                            setOpen(false);
                                            generateOrganization({
                                                hasRoom: false,
                                                name: name,
                                                delegatorId: uid
                                            }, {
                                                onSuccess: () => {
                                                    sendMail({
                                                        to: "scspace.kaist@gmail.com",
                                                        subject: `신규 등록 조직 소명: ${name}`,
                                                        template: "orgDescription",
                                                        context: {
                                                            meta: {
                                                                organizationName: name,
                                                                organizationDescription: description
                                                            }
                                                        }
                                                    }, {
                                                        onSuccess
                                                    });
                                                }
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