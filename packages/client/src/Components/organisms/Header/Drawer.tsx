"use client"

import { HiOutlineBars3 } from "react-icons/hi2";
import {
    IconButton,
    CloseButton,
    Drawer,
    Portal,
    Separator,
    Stack,
    StackSeparator,
    Fieldset,
    Text,
} from "@chakra-ui/react";

import Redirect from "./Redirect";
import Footer from "./Footer";
import { useState } from "react";

export default function DrawerComponent() {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Drawer.Root
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
            placement="start"
            size="sm"
            initialFocusEl={() => null}
        >
            <Drawer.Trigger asChild>
                <IconButton
                    variant="outline"
                    rounded="sm"
                >
                    <HiOutlineBars3 />
                </IconButton>
            </Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header>
                            <Drawer.Title>
                                학생문화공간위원회
                                <Text
                                    fontSize="lg"
                                    color="gray.500"
                                    margin={0}
                                >
                                    Student Curture & Space Commitee
                                </Text>
                            </Drawer.Title>
                        </Drawer.Header>
                        <Separator />
                        <Drawer.Body
                            scrollbar="hidden"
                            scrollBehavior="smooth"
                            overflowY="auto"
                        >
                            <Stack
                                separator={<StackSeparator />}
                                my={4}
                                gap={4}
                            >
                                <Fieldset.Root>
                                    <Fieldset.Content pr={4} >
                                        <Redirect onClick={() => setOpen(false)} />
                                    </Fieldset.Content>
                                </Fieldset.Root>
                            </Stack>
                        </Drawer.Body>
                        <Drawer.Footer
                            bg="gray.50"
                            color="gray.700"
                            px={4}
                            py={2}
                        >
                            <Footer />
                        </Drawer.Footer>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root >
    );
}