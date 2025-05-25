"use client";

import { Button, Card, Center, CloseButton, Dialog, DialogPositioner, HStack, Portal, Separator, Stack, StackSeparator, useBreakpointValue } from "@chakra-ui/react";
import Link from "next/link";
import Scroll from "../_commons/Scroll";
import PrivacyPolicy from "./PrivacyPolicy";

export default function SSOLogin() {
    const isWide = useBreakpointValue({ base: false, md: true });

    return (
        <Dialog.Root size="full" scrollBehavior="inside">
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <PrivacyPolicy />
                </Dialog.Positioner>
            </Portal>
            <Scroll>
                <Card.Root height="100%">
                    <Card.Body>
                        <HStack separator={<StackSeparator />} width="100%" height="100%">
                            {isWide && (
                                <Center width="100%" height="100%">
                                    신학관 사진?
                                </Center>
                            )}
                            <Center width="100%" height="100%">
                                <Card.Root borderColor="fg.success">
                                    <Card.Header gap={4}>
                                        <Card.Title>
                                            KAIST SSO LOGIN
                                        </Card.Title>
                                        <Stack color="fg.subtle" fontSize="sm" gap={0}>
                                            <Card.Description>
                                                KAIST 학생문화공간위원회 사이트는 KAIST SSO (Pass-Ni) 로그인만을 지원합니다.
                                            </Card.Description>
                                            <Card.Description>
                                                The KAIST Student Culture & Space Committee website only supports KAIST SSO (Pass-Ni) login.
                                            </Card.Description>
                                        </Stack>
                                        <Button bg={{ base: "#01438F" }} fontWeight={{ base: "semibold", _hover: "bold" }} asChild>
                                            <Link href="/login/sso" passHref>
                                                Login as a KAIST SSO
                                            </Link>
                                        </Button>
                                    </Card.Header>
                                    <Card.Body />
                                    <Card.Footer>
                                        <Stack gap={4}>
                                            <Stack color="fg.subtle" fontSize="sm" gap={0}>
                                                <Card.Description>
                                                    본 SSO 로그인을 통해 학생문화공간위원회의 개인정보처리방침에 동의하게 됩니다.
                                                </Card.Description>
                                                <Card.Description>
                                                    By registering with this SSO, you agree to the Student Culture & Space Committee Privacy Policy.
                                                </Card.Description>
                                            </Stack>
                                            <Dialog.Trigger width='100%' asChild>
                                                <Button variant="outline" borderColor="fg.subtle">
                                                    Show Privacy Policy
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
        </Dialog.Root>
    )
}