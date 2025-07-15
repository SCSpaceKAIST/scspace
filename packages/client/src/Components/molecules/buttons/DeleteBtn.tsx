// atoms/DeleteBtn.tsx

import { Button, Dialog, Portal, Text, } from "@chakra-ui/react";

export default function DeleteBtn({ onDelete }: {
    onDelete: () => any
}) {

    return (
        <Dialog.Root
            role="alertdialog"
            placement="center"
        >
            <Dialog.Trigger asChild>
                <Button colorPalette="red" rounded="sm">
                    Delete
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop zIndex={1500} />
                <Dialog.Positioner zIndex={1600}>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Are you sure?</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Text>
                                This action is permanent and cannot be undone,
                            </Text>
                            <Text>
                                and the data will be completely removed from our systems.
                            </Text>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button
                                    colorPalette="red"
                                    rounded="sm"
                                    onClick={onDelete}
                                >
                                    Delete
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