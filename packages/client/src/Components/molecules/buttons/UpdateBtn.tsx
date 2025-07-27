import { Dialog, DialogBackdrop, Button, Portal, IconButton } from "@chakra-ui/react";
import TooltipComponent from "@scspace-client/Components/atoms/Tooptip";
import { HiOutlinePencilAlt } from "react-icons/hi";

export default function UpdateBtn({ onUpdate, children, title, updateDisallowed, tooltipContent }: {
    onUpdate: () => void;
    children: React.ReactNode;
    title: string;
    updateDisallowed?: boolean;
    tooltipContent: string;
}) {
    return (
        <Dialog.Root
            role="alertdialog"
            placement="center"
        >
            <TooltipComponent content={tooltipContent}>
                <Dialog.Trigger asChild>
                    <IconButton size="xs" variant="ghost">
                        <HiOutlinePencilAlt color="gray" />
                    </IconButton>
                </Dialog.Trigger>
            </TooltipComponent>
            <Portal>
                <DialogBackdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>
                                {title}
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            {children}
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button
                                    colorPalette="blue"
                                    rounded="sm"
                                    disabled={updateDisallowed}
                                    onClick={onUpdate}
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
