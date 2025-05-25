"use client"

import { useEffect, useState } from "react";
import ILink from "./interfaces/Link";
import {
    Blockquote,
    Stack,
    StackSeparator,
    Button,
    Field,
    Collapsible,
} from "@chakra-ui/react";
import { HiPlus } from "react-icons/hi2";
import { useAllSpace } from "@scspace-client/Hooks/space";
import { useLinkPush } from "@scspace-client/Hooks/api";

function RedirectLinks({ links }: { links: ILink[] }) {
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
                    {links.map((l) => (
                        <Collapsible.Root
                            key={l.href}
                            as={Stack}
                            gap={0}
                        >
                            <Stack direction="row" >
                                <Button
                                    onClick={() => linkPush(l.href)}
                                    width="100%"
                                    margin={0}
                                    color={{ _hover: "blue.500" }}
                                >
                                    <Button
                                        variant="outline"
                                        rounded="sm"
                                        width="100%"
                                        height="fit-content"
                                        color="inherit"
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
                                </Button>
                                <Collapsible.Trigger
                                    mx={1}
                                    rounded="sm"
                                    height="inherit"
                                    display={(l.subdomains && l.subdomains.length > 0) ? "block" : "none"}
                                >
                                    <HiPlus />
                                </Collapsible.Trigger>
                            </Stack>
                            {(l.subdomains && l.subdomains.length > 0) &&
                                <Collapsible.Content mt={2}>
                                    <RedirectLinks links={l.subdomains} />
                                </Collapsible.Content>
                            }
                        </Collapsible.Root>
                    ))}
                </Stack>
            </Blockquote.Content>
        </Blockquote.Root>
    );
}

export default function Redirect() {
    const { spaces } = useAllSpace();
    const [spaceLinks, setSpaceLinks] = useState<ILink[]>([]);
    const [links, setLinks] = useState<ILink[]>([]);

    useEffect(() => {
        if (spaces) setSpaceLinks(spaces.map((s): ILink => {
            return {
                href: `/space/${s.id}`,
                helperText: s.nameEn,
                label: s.nameKr,
            }
        }))
    }, [spaces]);

    useEffect(() => {
        setLinks([
            {
                href: "/introduction",
                label: "공간위에 대해",
                helperText: "About SCSpace",
                disabled: true
            },
            {
                href: "/notice",
                label: "공지사항",
                helperText: "Notice",
                disabled: true
            },
            {
                href: "/reservation",
                label: "공간 예약하기",
                helperText: "Reservation",
            },
            {
                href: "/calendar",
                label: "예약 확인하기",
                helperText: "Calendar",
            },
            {
                href: "/space",
                label: "공간위 관리 공간",
                helperText: "Spaces",
                subdomains: spaceLinks,
            },
            {
                href: "/mypage",
                label: "마이페이지",
                helperText: "Mypage",
                subdomains: [
                    {
                        href: "/mypage/reservation",
                        label: "예약 목록",
                        helperText: "Reservation List",
                    },
                    {
                        href: "/mypage/organization",
                        label: "조직 관리",
                        helperText: "Organization"
                    }
                ]
            },
            {
                href: "/manage",
                label: "관리",
                helperText: "Management",
                disabled: true
            }
        ]);
    }, [spaceLinks]);

    return (<RedirectLinks links={links} />);
}