"use client";

import { Dialog, DialogBackdrop, Button, IconButton, Portal, Text } from "@chakra-ui/react";
import { useOrganizationAPI } from "@scspace-client/Hooks/organization";
import TooltipComponent from "@scspace-client/Components/atoms/Tooptip";
import { HiOutlineCheck } from "react-icons/hi2";
import { useMailAPI } from "@scspace-client/Hooks/mail";
import { IOrganizationAll } from "@scspace-depot/types/organization";

export default function RequestVerifyBtn({ organization, refetch }: {
    organization: IOrganizationAll,
    refetch: () => any;
}) {

    const reqVerify = useOrganizationAPI({ id: organization.id }).status.requestVerification;
    const { sendMail } = useMailAPI();

    return (
        <Dialog.Root
            role="alertdialog"
            placement="center"
        >
            <TooltipComponent content="Request Verification">
                <Dialog.Trigger asChild>
                    <IconButton size="sm" variant="outline" rounded="sm">
                        <HiOutlineCheck color="gray" />
                    </IconButton>
                </Dialog.Trigger>
            </TooltipComponent>
            <Portal>
                <DialogBackdrop zIndex={1500} />
                <Dialog.Positioner zIndex={1600}>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>
                                Request Verification
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Text>
                                Click the button below to request verification for your organization.
                            </Text>
                            <Text>
                                Once requested, the organization will be reviewed by our team.
                            </Text>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button colorPalette="blue" rounded="sm"
                                    onClick={() => reqVerify({
                                        onSuccess: () => {
                                            alert("Verification request sent successfully.");
                                            sendMail({
                                                to: "scspace@kaist.ac.kr",
                                                subject: `조직 인증 신청 [ ${organization.name} ]`,
                                                template: "orgVerify",
                                                context: {
                                                    organization
                                                }
                                            })
                                            refetch();
                                        }
                                    })}
                                >
                                    Apply
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