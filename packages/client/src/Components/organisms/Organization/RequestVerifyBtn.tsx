import { Dialog, DialogBackdrop, Button, IconButton, Portal, Fieldset, Field, HStack, PinInput, Stack, Text, VStack, Wrap, Grid, useBreakpointValue } from "@chakra-ui/react";
import { useOrganizationAPI } from "@scspace-client/Hooks/organization";
import TooltipComponent from "@scspace-client/Components/atoms/Tooptip";
import { HiOutlineCheck } from "react-icons/hi2";

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
                <TooltipComponent content="Request Verification">
                    <IconButton size="sm" variant="outline" rounded="sm">
                        <HiOutlineCheck color="gray" />
                    </IconButton>
                </TooltipComponent>
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
                                    onClick={() => reqVerify({
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