"use client";

import { Button, CloseButton, Dialog, Tabs, useBreakpointValue, VStack } from "@chakra-ui/react";
import { ENG } from "./Eng";

export default function PrivacyPolicy({ onRead }: { onRead: () => void }) {
    const isWide = useBreakpointValue({ base: false, md: true });

    return (
        <Dialog.Content minH="100svh">
            <Dialog.Header gap={4}>
                <Tabs.List width="100%">
                    <Tabs.Trigger value="Eng">
                        English
                    </Tabs.Trigger>
                    <Tabs.Trigger value="Kor" disabled>
                        한국어
                    </Tabs.Trigger>
                </Tabs.List>
            </Dialog.Header>
            <Dialog.Body>
                <VStack>
                    <Tabs.Content value="Eng">
                        <ENG />
                    </Tabs.Content>
                    <Tabs.Content value="Kor">
                        한국어
                    </Tabs.Content>
                    <Dialog.ActionTrigger asChild>
                        <Button colorPalette="blue" onClick={onRead}>
                            Accept
                        </Button>
                    </Dialog.ActionTrigger>
                </VStack>
            </Dialog.Body>
            <Dialog.Footer>
                <Dialog.Title>
                    <Tabs.Content value="Eng">
                        {isWide ? (
                            "KAIST Student Culture & Space Committee"
                        ) : (
                            "KAIST SCSpace"
                        )}
                    </Tabs.Content>
                    <Tabs.Content value="Kor">
                        KAIST 학생문화공간위원회
                    </Tabs.Content>
                </Dialog.Title>
            </Dialog.Footer>
            <Dialog.CloseTrigger>
                <CloseButton />
            </Dialog.CloseTrigger>
        </Dialog.Content>
    );
}