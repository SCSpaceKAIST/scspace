"use client";

import {
    Box,
    Stack,
    Link,
    Text
} from "@chakra-ui/react";
import {
    IoMailOutline,
    IoLogoInstagram
} from "react-icons/io5"


export default function Footer() {
    const footerText: string[][] = [
        [
            "대전광역시 유성구 대학로 291 한국과학기술원",
            "N13-1 장영신학생회관 309호"
        ],
        [
            "월, 화, 수 상근 19 - 21 시 | 목 상근 21 - 23 시"
        ],
    ];

    const contact: {
        icon: React.ReactNode;
        label: string;
        href: string;
    }[] = [
            {
                icon: <IoMailOutline />,
                label: "scspace@kaist.ac.kr",
                href: "mailto:scspace@kaist.ac.kr"
            },
            {
                icon: <IoLogoInstagram />,
                label: "@scspace_kaist",
                href: "https://instagram.com/scspace_kaist"
            }
        ];

    return (
        <Stack
            width="100%"
            gap={2}
        >
            {footerText.map((box, i) => (
                <Box
                    borderWidth="1px"
                    borderColor="border.disabled"
                    key={i}
                    padding={2}
                    rounded="sm"
                >
                    {box.map((text) => (
                        <Text
                            key={text}
                            margin={0}
                        >
                            {text}
                        </Text>
                    ))}
                </Box>
            ))}
            <Stack
                borderWidth="1px"
                borderColor="border.disabled"
                padding={2}
                rounded="sm"
            >
                {contact.map((c) => (
                    <Link
                        target='_blank'
                        href={c.href}
                        key={c.href}
                        color={{ _hover: "blue.500" }}
                    >
                        {c.icon}{c.label}
                    </Link>
                ))}
            </Stack>
        </Stack>
    );
}