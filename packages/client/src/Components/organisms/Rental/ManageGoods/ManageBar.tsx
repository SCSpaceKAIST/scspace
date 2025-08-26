import { ActionBar, Button, Dialog, Portal } from "@chakra-ui/react";
import ManageDialog from "./ManageDialog";

export default function ManageBar({ name, id, onChange }: {
    name: string | null,
    id: number | null,
    onChange: () => void
}) {
    return (
        <ActionBar.Root open>
            <Portal>
                <ActionBar.Positioner>
                    <ActionBar.Content>
                        {name && (
                            <>
                                <ActionBar.SelectionTrigger>
                                    {name}
                                </ActionBar.SelectionTrigger>
                                <ActionBar.Separator />
                            </>
                        )}
                        <ManageDialog
                            id={id ?? -1}
                            onChange={onChange}
                        />
                    </ActionBar.Content>
                </ActionBar.Positioner>
            </Portal>
        </ActionBar.Root>
    );
}