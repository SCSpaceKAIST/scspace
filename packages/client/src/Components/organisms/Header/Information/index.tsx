import { DataList, Dialog, IconButton, Portal, Stack } from "@chakra-ui/react";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import InformationList from "../../../../../static/InformationList.json";

export default function Information() {
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
                                    Simple Information
                                </Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <DataList.Root>
                                    {InformationList.toReversed().map((info) => (
                                        <DataList.Item key={info.title} gap={0}>
                                            <DataList.ItemLabel>
                                                {info.title}
                                            </DataList.ItemLabel>
                                            <DataList.ItemValue margin={0}>
                                                {info.content}
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