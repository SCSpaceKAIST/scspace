"use client"

import { Alert, Button, Collapsible, Stack } from "@chakra-ui/react";
import { PasspinHooks } from "@scspace-client/Hooks/passpin";

export default function PasspinHeader() {
    const { data, refetch } = PasspinHooks.usePasspin();

    if (!data || data.length === 0) return null;

    return (
        <Collapsible.Root>
            <Stack mx={2} mt={2}>
                <Collapsible.Trigger asChild w={"full"}>
                    <Button size={"xs"} variant={"subtle"} p={2} colorPalette={"blue"} onClick={() => refetch()}>
                        Passpin (Click to Show)
                    </Button>
                </Collapsible.Trigger>
                <Collapsible.Content maxH={"xs"} overflowY={"auto"}>
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
                </Collapsible.Content>
            </Stack>
        </Collapsible.Root>
    );
}