import { DataList, Dialog, IconButton, Portal, Stack } from "@chakra-ui/react";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import changeLog from "../../../static/changeLog.json";

export default function ChangeLog() {
    return (
        <Dialog.Root placement="center">
            <Dialog.Trigger asChild>
                <IconButton variant="ghost">
                    <HiOutlineInformationCircle />
                </IconButton>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop>
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>
                                    Change Log
                                </Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <DataList.Root orientation="horizontal">
                                    {changeLog.toReversed().map((log) => (
                                        <DataList.Item key={log.date} gap={0}>
                                            <DataList.ItemLabel>
                                                {log.date}
                                            </DataList.ItemLabel>
                                            <DataList.ItemValue margin={0}>
                                                {log.content}
                                            </DataList.ItemValue>
                                        </DataList.Item>
                                    ))}
                                </DataList.Root>
                            </Dialog.Body>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Dialog.Backdrop>
            </Portal>
        </Dialog.Root>
    );
}