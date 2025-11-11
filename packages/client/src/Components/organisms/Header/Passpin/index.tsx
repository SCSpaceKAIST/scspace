"use client"

import { Alert, Box, Button, Center, CloseButton, Collapsible, Dialog, Flex, Stack } from "@chakra-ui/react";
import { PasspinHooks } from "@scspace-client/Hooks/passpin";

export default function PasspinHeader() {
    const { data, refetch } = PasspinHooks.usePasspin();

    if (!data || data.length === 0) return null;

    return (
        <Dialog.Root scrollBehavior={"inside"}>
            <Dialog.Trigger asChild>
                <Button
                    size={"xs"}
                    colorPalette={"blue"}
                    onClick={() => refetch()}
                >
                    Show Passpins
                </Button>
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Flex justify={"space-between"} w={"full"}>
                            <Dialog.Title>
                                Passpins
                            </Dialog.Title>
                            <Dialog.ActionTrigger asChild>
                                <CloseButton size={"xs"} variant={"outline"} />
                            </Dialog.ActionTrigger>
                        </Flex>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Stack>
                            {data.map((d) => (
                                <Alert.Root key={d.id}>
                                    <Alert.Title>
                                        {d.pin}
                                    </Alert.Title>
                                    <Alert.Description>
                                        {d.space.nameKr} ({d.space.nameEn})
                                    </Alert.Description>
                                </Alert.Root>
                            ))}
                        </Stack>
                    </Dialog.Body>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
}