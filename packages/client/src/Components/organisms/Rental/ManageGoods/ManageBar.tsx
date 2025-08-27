import { ActionBar, Button, Dialog, Portal } from "@chakra-ui/react";
import ManageDialog from "./ManageDialog";
import { IGoods } from "@scspace-depot/types/rental";

export default function ManageBar({ item, onChange }: {
    item: IGoods | null
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