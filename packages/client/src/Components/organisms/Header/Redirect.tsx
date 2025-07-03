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
    Grid,
    IconButton,
} from "@chakra-ui/react";
import { HiPlus } from "react-icons/hi2";
import { useAllSpace } from "@scspace-client/Hooks/space";
import { useLinkPush } from "@scspace-client/Hooks/api";
import { useAuth } from "@scspace-client/Hooks/auth";
import { UserTypeEnum } from "@scspace-depot/enums/user.enum";

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
                href: `/space/${s.id}`,
                helperText: s.nameEn,
                label: s.nameKr,
            }
        }))
    }, [spaces]);

    useEffect(() => {
        if (spaces) setCalendarLinks(
            spaces.map((s): ILink => ({
                href: `/calendar/${s.id}`,
                helperText: s.nameEn,
                label: s.nameKr,
            }))
        )
    }, [spaces]);

    useEffect(() => {
        setLinks([
            {
                href: "/report",
                label: "오류 제보하기",
                helperText: "Reporting Error",
            },
            {
                href: "/about",
                label: "찾아보기",
                helperText: "About SCSpace",
                subdomains: [
                    {
                        href: '/about/scspace',
                        label: "공간위",
                        helperText: "SCSpace"
                    },
                    {
                        href: '/about/rules',
                        label: "세칙",
                        helperText: "Rules"
                    }
                ]
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
                label: "예약 현황",
                helperText: "Calendar",
                subdomains: calendarLinks,
            },
            {
                href: "/",
                label: "물품 대여하기",
                helperText: "Rental",
                disabled: true
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
                visible: isLogined,
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
                visible: isManager,
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
                    }
                ]
            }
        ]);
    }, [spaceLinks, isLogined, isAdmin, userInfo]);

    return (<RedirectLinks links={links} onClick={onClick} />);
}