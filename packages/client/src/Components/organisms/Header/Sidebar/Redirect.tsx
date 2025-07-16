"use client"

import { useEffect, useState } from "react";
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
import { useAllSpace } from "@scspace-client/Hooks/space";
import { useLinkPush } from "@scspace-client/Hooks/api";
import { useAuth } from "@scspace-client/Hooks/auth";

interface ILink {
    href: string;
    helperText: string;
    label: string;
    subdomains?: ILink[];
    disabled?: boolean;
    visible?: boolean;
}

function RedirectLinks({ links, onClick }: {
    links: ILink[];
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
                    {links.filter(l => l.visible ?? true).map((l) => (
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
    const { spaces } = useAllSpace();
    const [spaceLinks, setSpaceLinks] = useState<ILink[]>([]);
    const [calendarLinks, setCalendarLinks] = useState<ILink[]>([]);
    const [links, setLinks] = useState<ILink[]>([]);
    const { userInfo, isAdmin, isManager, isLogined } = useAuth();

    useEffect(() => {
        if (spaces) setSpaceLinks(spaces.map((s): ILink => {
            return {
                href: `/browse/space/${s.id}`,
                helperText: s.nameEn,
                label: s.nameKr,
            }
        }))
    }, [spaces]);

    useEffect(() => {
        if (spaces) setCalendarLinks(
            spaces.map((s): ILink => ({
                href: `/reservation/status/${s.id}`,
                helperText: s.nameEn,
                label: s.nameKr,
            }))
        )
    }, [spaces]);

    useEffect(() => {
        setLinks([
            {
                href: "/browse",
                label: "찾아보기",
                helperText: "Browse",
                subdomains: [
                    {
                        href: '/browse/scspace',
                        label: "공간위",
                        helperText: "SCSpace"
                    },
                    {
                        href: "/browse/space",
                        label: "공간",
                        helperText: "Spaces",
                        subdomains: spaceLinks,
                    },
                    {
                        href: '/browse/rules',
                        label: "세칙",
                        helperText: "Rules"
                    }
                ]
            },
            {
                href: "/article",
                label: "게시판",
                helperText: "Article",
                disabled: true
            },
            {
                href: "/organization",
                label: "조직",
                helperText: "Organization",
                subdomains: [
                    {
                        href: "/organization/verifed",
                        label: "인증된 조직",
                        helperText: "Verified Organization"
                    },
                    {
                        href: "/mypage/organization",
                        label: "내 조직",
                        helperText: "My Organization"
                    },
                ]
            },
            {
                href: "/reservation",
                label: "예약",
                helperText: "Reservation",
                subdomains: [
                    {
                        href: "/reservation/application",
                        label: "신청",
                        helperText: "Application"
                    },
                    {
                        href: "/reservation/status",
                        label: "현황",
                        helperText: "Status",
                        subdomains: calendarLinks
                    },
                    {
                        href: "/mypage/reservation",
                        label: "내 예약",
                        helperText: "My Reservation"
                    }
                ]
            },
            {
                href: "/",
                label: "물품 대여하기",
                helperText: "Rental",
                disabled: true
            },
            {
                href: "/manage",
                label: "관리",
                helperText: "Management",
                visible: isManager,
                subdomains: [
                    {
                        href: "/manage/organization",
                        label: "조직",
                        helperText: "Organization"
                    },
                    {
                        href: "/manage/reservation",
                        label: "예약",
                        helperText: "Reservation"
                    }
                ]
            },
            {
                href: "/admin",
                label: "운영",
                helperText: "Administration",
                visible: isAdmin,
                subdomains: [
                    {
                        href: "/admin/user",
                        label: "유저 관리",
                        helperText: "Manage User"
                    },
                    {
                        href: "/manage/rules",
                        label: "세칙",
                        helperText: "Rules"
                    }
                ]
            },
            {
                href: "/dev",
                label: "개발",
                helperText: "Development",
                visible: isAdmin,
            }
        ]);
    }, [spaceLinks, isLogined, isAdmin, userInfo]);

    return (<RedirectLinks links={links} onClick={onClick} />);
}