import { Button, Dialog, Portal } from "@chakra-ui/react";

export default function ManageDialog() {
    return (
        <Dialog.Root placement={"center"}>
            <Dialog.Trigger asChild>
                <Button variant={"outline"}>
                    Manage
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop>
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>
                                    Manage Items
                                </Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                Body
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Dialog.ActionTrigger asChild>
                                    <Button variant={"outline"}>
                                        Close
                                    </Button>
                                </Dialog.ActionTrigger>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Dialog.Backdrop>
            </Portal>
        </Dialog.Root>
    );
}