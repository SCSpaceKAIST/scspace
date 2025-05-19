"use client"

import { useState } from "react";
import ILink from "./interfaces/Link";
import {
    Blockquote,
    Stack,
    StackSeparator,
    Link,
    Button,
    Field,
    Collapsible,
} from "@chakra-ui/react";
import { HiPlus } from "react-icons/hi2";

function RedirectLinks({ links }: { links: ILink[] }) {
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
                            defaultOpen
                            gap={0}
                        >
                            <Stack direction="row" >
                                <Link
                                    href={l.href}
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
                                </Link>
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
    const [spaces, setSpaces] = useState<ILink[]>([
        {
            href: "/space/individual-practice-room",
            helperText: "Individual Practice Room",
            label: "개인연습실"
        }, {
            href: "/space/piano-room",
            helperText: "Piano Room",
            label: "피아노실"
        },
        {
            href: "/space/ullim-hall",
            helperText: "Josumi Hall",
            label: "조수미홀",
        },
        {
            href: "/space/mirae-hall",
            helperText: "Mirae Hall",
            label: "미래홀"
        },
        {
            href: "/space/seminar-room",
            helperText: "Seminar Room",
            label: "세미나실"
        },
        {
            href: "/space/open-space",
            helperText: "Open Space",
            label: "오픈 스페이스"
        },
        {
            href: "/space/group-practice-room",
            helperText: "Ensemble Room",
            label: "합주실"
        },
        {
            href: "/space/dance-studio",
            helperText: "Dance Studio",
            label: "무예실"
        },
        {
            href: "/space/workshop",
            helperText: "Workshop",
            label: "창작공방",
        },
        {
            href: "/",
            helperText: "Busking Zone",
            label: "버스킹 존"
        }
    ]);

    const [links, setLinks] = useState<ILink[]>([
        {
            href: "/introduction",
            label: "공간위에 대해",
            helperText: "About SCSpace",
        },
        {
            href: "/reservation",
            label: "공간 예약하기",
            helperText: "Reservation",
        },
        {
            href: "/space",
            label: "공간위 관리 공간",
            helperText: "Spaces",
            subdomains: spaces,
        },
        {
            href: "/mypage",
            label: "마이페이지",
            helperText: "Mypage",
            subdomains: [
                {
                    href: "/mypage/org",
                    label: "조직 관리",
                    helperText: "Organization"
                }
            ]
        },
        {
            href: "/manage",
            label: "관리",
            helperText: "Management"
        }
    ]);

    return (<RedirectLinks links={links} />);
}