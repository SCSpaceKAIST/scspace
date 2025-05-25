"use client";

import { createToaster, HStack, Stack, Toast, Toaster, } from "@chakra-ui/react";

export const toaster = createToaster({
    placement: "bottom-end",
});

export default function ToasterComponent() {
    return (
        <Toaster toaster={toaster}>
            {(toast) => (
                <Toast.Root asChild width="calc(var(--screen-width) * 0.18)">
                    <HStack margin={0} padding={0} gap={3}>
                        <Toast.Indicator />
                        <Stack>
                            <Toast.Title>
                                {toast.title ?? "Title"}
                            </Toast.Title>
                            <Toast.Description>
                                {toast.description ?? "Description"}
                            </Toast.Description>
                        </Stack>
                    </HStack>
                </Toast.Root>
            )}
        </Toaster>
    );
}
