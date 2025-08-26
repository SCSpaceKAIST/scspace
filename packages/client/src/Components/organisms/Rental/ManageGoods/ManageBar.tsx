import { ActionBar, Button, Dialog, Portal } from "@chakra-ui/react";
import ManageDialog from "./ManageDialog";
import { ICartItem } from "../List";

export default function ManageBar({ item, onChange }: {
    item: ICartItem | null
    onChange: () => void
}) {
    return (
        <ActionBar.Root open>
            <Portal>
                <ActionBar.Positioner>
                    <ActionBar.Content>
                        {item && (
                            <>
                                <ActionBar.SelectionTrigger>
                                    {item.name}
                                </ActionBar.SelectionTrigger>
                                <ActionBar.Separator />
                            </>
                        )}
                        <ManageDialog
                            id={item?.id ?? -1}
                            onChange={onChange}
                        />
                    </ActionBar.Content>
                </ActionBar.Positioner>
            </Portal>
        </ActionBar.Root>
    );
}