"use client";

import { Box, Button, Card, Center, CloseButton, Dialog, DialogPositioner, HStack, Portal, Separator, Stack, StackSeparator, Tabs, Text, useBreakpointValue } from "@chakra-ui/react";
import Scroll from "../templates/Scroll";
import PrivacyPolicy from "../organisms/Login/PrivacyPolicy";
import { useLinkPush } from "@scspace-client/Hooks/api";
import { useState } from "react";
import Image from "next/image";
import TooltipComponent from "../templates/Tooptip";

export default function SSOLogin() {
    const isWide = useBreakpointValue({ base: false, md: true });
    const { linkPush } = useLinkPush();

    const [read, setRead] = useState<boolean>(false);

    return (
        <Dialog.Root size="full" scrollBehavior="inside">
            <Portal>
                <Dialog.Backdrop />
                <Tabs.Root defaultValue="Eng">
                    <Dialog.Positioner>
                        <PrivacyPolicy onRead={() => setRead(true)} />
                    </Dialog.Positioner>
                </Tabs.Root>
            </Portal>
            <Scroll>
                <Card.Root height="100%">
                    <Card.Body>
                        <HStack separator={<StackSeparator />} width="100%" height="100%" gap={6}>
                            {isWide && (
                                <Box width="100%" height="100%" position="relative">
                                    <Image
                                        fill
                                        style={{ objectFit: "cover" }}
                                        src="/img/testimonials-bg.jpg"
                                        alt="Business"
                                    />
                                </Box>
                            )}
                            <Center width="100%" height="100%">
                                <Card.Root borderColor="fg.success">
                                    <Card.Header gap={4}>
                                        <Card.Title>
                                            KAIST SSO LOGIN
                                        </Card.Title>
                                        <Stack color="fg.subtle" fontSize="sm" gap={0}>
                                            {isWide && (
                                                <Card.Description>
                                                    KAIST 학생문화공간위원회 사이트는 KAIST SSO (Pass-Ni) 로그인만을 지원합니다.
                                                </Card.Description>
                                            )}
                                            <Card.Description>
                                                The KAIST SCSpace website only supports KAIST SSO (Pass-Ni) login.
                                            </Card.Description>
                                        </Stack>
                                        <TooltipComponent
                                            content={(
                                                <Text>
                                                    {read ? (
                                                        "Click to login with KAIST SSO"
                                                    ) : (
                                                        "Please read Privacy Policy before login with KAIST SSO"
                                                    )}
                                                </Text>
                                            )}
                                        >
                                            <Button bg={{ base: "#01438F", _disabled: "fg.error" }} fontWeight={{ base: "semibold", _hover: "bold" }} onClick={() => linkPush("/login/sso")} disabled={!read}>
                                                Login as a KAIST SSO
                                            </Button>
                                        </TooltipComponent>
                                    </Card.Header>
                                    <Card.Body />
                                    <Card.Footer>
                                        <Stack gap={4}>
                                            <Stack color="fg.subtle" fontSize="sm" gap={0}>
                                                {isWide && (
                                                    <Card.Description>
                                                        본 SSO 로그인을 통해 학생문화공간위원회의 개인정보처리방침에 동의하게 됩니다.
                                                    </Card.Description>
                                                )}
                                                <Card.Description>
                                                    By registering with this SSO, you agree to the SCSpace Privacy Policy.
                                                </Card.Description>
                                            </Stack>
                                            <Dialog.Trigger width='100%' asChild>
                                                <Button colorPalette="green">
                                                    Read Privacy Policy
                                                </Button>
                                            </Dialog.Trigger>
                                        </Stack>
                                    </Card.Footer>
                                </Card.Root>
                            </Center>
                        </HStack>
                    </Card.Body>
                </Card.Root>
            </Scroll>
        </Dialog.Root >
    )
}