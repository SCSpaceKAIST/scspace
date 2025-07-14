"use client"

import {
    Dialog,
    Portal,
    useBreakpointValue,
} from "@chakra-ui/react";
import React, { Dispatch, SetStateAction } from "react";

export default function SimpleDialog({ open, setOpen, children }: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    children: React.ReactNode;
}) {
    const isWide = useBreakpointValue({ base: false, md: true });

    return (
        <Dialog.Root
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
            size={isWide ? "cover" : "full"}
            scrollBehavior="inside"
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content className={isWide ? "" : "full"} minH="full">
                        {children}
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root >
    );
}