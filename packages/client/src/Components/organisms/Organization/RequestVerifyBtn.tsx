"use client";

import { Dialog, DialogBackdrop, Button, Portal, Text } from "@chakra-ui/react";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import { useOrganizationAPI } from "@scspace-client/Hooks/organization";

export default function RequestVerifyBtn({ oid, refetch }: {
    oid: number,
    refetch: () => any;
}) {

    const reqVerify = useOrganizationAPI({ id: oid }).status.requestVerification;

    return (
        <Dialog.Root
            role="alertdialog"
            placement="center"
        >
            <Dialog.Trigger asChild>
                <Button size="sm" variant="outline" rounded="sm">
                    Request Verification
                </Button>
            </Dialog.Trigger>
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
                                    onClick={() => reqVerify({}, {
                                        onSuccess: () => {
                                            toaster.success({
                                                title: "Verification Request Sent",
                                                description: "Your request for organization verification has been sent successfully."
                                            });
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