import { Button, Dialog, Portal, } from "@chakra-ui/react";

export default function AlertBtn({
    onClick,
    colorPalette,
    buttonText,
    innerButtonText,
    dialogTitle,
    children
}: {
    onClick: () => any;
    colorPalette?: string;
    buttonText: string;
    innerButtonText?: string;
    dialogTitle?: string;
    children?: React.ReactNode;
}) {

    return (
        <Dialog.Root
            role="alertdialog"
            placement="center"
        >
            <Dialog.Trigger asChild>
                <Button
                    colorPalette={colorPalette ?? "blue"}
                    rounded="sm"
                // px={2}
                // py={1}
                // height="fit-content"
                >
                    {buttonText}
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop zIndex={1500} />
                <Dialog.Positioner zIndex={1600}>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>
                                {dialogTitle ?? "Title of the action."}
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            {children ?? "Description of the action."}
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline" rounded="sm">
                                    Cancel
                                </Button>
                            </Dialog.ActionTrigger>
                            <Dialog.ActionTrigger asChild>
                                <Button
                                    colorPalette={colorPalette ?? "blue"}
                                    rounded="sm"
                                    onClick={onClick}
                                >
                                    {innerButtonText ?? buttonText}
                                </Button>
                            </Dialog.ActionTrigger>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root >
    );
}