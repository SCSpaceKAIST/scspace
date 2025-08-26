import { ActionBar, Button, Dialog, Portal } from "@chakra-ui/react";
import ManageDialog from "./ManageDialog";

export default function ManageBar() {
    return (
        <ActionBar.Root open>
            <Portal>
                <ActionBar.Positioner>
                    <ActionBar.Content>
                        <ActionBar.SelectionTrigger>
                            Selection Trigger
                        </ActionBar.SelectionTrigger>
                        <ActionBar.Separator />
                        <ManageDialog />
                    </ActionBar.Content>
                </ActionBar.Positioner>
            </Portal>
        </ActionBar.Root>
    );
}