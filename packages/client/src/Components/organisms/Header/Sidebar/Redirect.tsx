"use client"

import {
    Blockquote,
    Stack,
    StackSeparator,
    Button,
    Field,
    Collapsible,
    Grid,
    IconButton,
} from "@chakra-ui/react";
import { HiPlus } from "react-icons/hi2";
import { useLinkPush } from "@scspace-client/Hooks/api";
import { IRedirect, useRedirectStore } from "@scspace-client/Store/redirect";


function RedirectLinks({ links, onClick }: {
    links: IRedirect[];
    onClick: () => void
}) {
    const { linkPush } = useLinkPush();

    return (
        <Blockquote.Root
            width="100%"
            margin={0}
            pr={0}
        >
            <Blockquote.Content
                width="100%"
                margin={0}
            >
                <Stack separator={<StackSeparator />} >
                    {links.filter(l => !l.invisible).map((l) => (
                        <Collapsible.Root
                            key={l.href}
                            as={Stack}
                            gap={0}
                        >
                            <Grid templateColumns="1fr auto" width="100%" gap={1}>
                                <Button
                                    width="100%"
                                    onClick={() => {
                                        onClick();
                                        linkPush(l.href);
                                    }}
                                    margin={0}
                                    color={{ _hover: "blue.500" }}
                                    variant="outline"
                                    rounded="sm"
                                    height="fit-content"
                                    disabled={l.disabled ?? false}
                                >
                                    <Field.Root
                                        margin={2}
                                        gap={0}
                                    >
                                        <Field.Label>
                                            {l.label}
                                        </Field.Label>
                                        <Field.HelperText>
                                            {l.helperText}
                                        </Field.HelperText>
                                    </Field.Root>
                                </Button>
                                {(l.subdomains && l.subdomains.length > 0) && (
                                    <Collapsible.Trigger
                                        mx={1}
                                        rounded="sm"
                                        height="inherit"
                                        asChild
                                    >
                                        <IconButton size="xs" variant="outline" height="100%">
                                            <HiPlus />
                                        </IconButton>
                                    </Collapsible.Trigger>
                                )}
                            </Grid>
                            {(l.subdomains && l.subdomains.length > 0) &&
                                <Collapsible.Content mt={2} >
                                    <RedirectLinks links={l.subdomains} onClick={onClick} />
                                </Collapsible.Content>
                            }
                        </Collapsible.Root>
                    ))}
                </Stack>
            </Blockquote.Content>
        </Blockquote.Root>
    );
}

export default function Redirect({ onClick }: { onClick: () => void }) {
    const { links } = useRedirectStore();
    return (<RedirectLinks links={links} onClick={onClick} />);
}