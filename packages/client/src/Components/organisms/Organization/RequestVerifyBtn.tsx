"use client";

import { Dialog, DialogBackdrop, Button, Portal, Text } from "@chakra-ui/react";
import { useOrganizationAPI } from "@scspace-client/Hooks/organization";
import TooltipComponent from "@scspace-client/Components/atoms/Tooptip";
import { IOrganizationAll } from "@scspace-depot/types/organization";

export default function RequestVerifyBtn({ organization, refetch }: {
    organization: IOrganizationAll,
    refetch: () => any;
}) {

    const reqVerify = useOrganizationAPI({ id: organization.id }).status.requestVerification;

    return (
        <Dialog.Root
            role="alertdialog"
            placement="center"
        >
            <TooltipComponent content="Request Verification">
                <Dialog.Trigger asChild>
                    <Button size="sm" variant="outline" rounded="sm">
                        Request Verification
                    </Button>
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
                                    onClick={() => reqVerify({}, {
                                        onSuccess: () => {
                                            alert("Verification request sent successfully.");
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