"use client";

import { Button, createToaster, HStack, IconButton, Stack, Toast, Toaster, } from "@chakra-ui/react";
import { HiX } from "react-icons/hi";

export const toaster = createToaster({
    placement: "bottom-end",
    removeDelay: 500,

});

export default function ToasterComponent() {
    return (
        <Toaster toaster={toaster}>
            {(toast) => (
                <Toast.Root width={{ md: "calc(var(--screen-width) * 0.18)", base: "82svw" }}>
                    <HStack margin={0} padding={0} gap={3}>
                        <Toast.Indicator />
                        <Stack>
                            <Toast.Title>
                                {toast.title ?? "Title"}
                            </Toast.Title>
                            {toast.description && (
                                <Toast.Description>
                                    {toast.description}
                                </Toast.Description>
                            )}
                        </Stack>
                        <Toast.CloseTrigger asChild>
                            <IconButton variant="ghost" size="sm">
                                <HiX />
                            </IconButton>
                        </Toast.CloseTrigger>
                    </HStack>
                </Toast.Root>
            )}
        </Toaster>
    );
}
