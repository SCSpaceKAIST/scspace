"use client";

import { Flex, Box, Text, Stack, Button } from "@chakra-ui/react";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import { useAuth } from "@scspace-client/Hooks/auth";
import { useLinkPush } from "@scspace-client/Hooks/api";

const bannerStyle = {
    backgroundColor: "lightgray",
    backgroundSize: "cover",
    backgroundPosition: "50%",
    backgroundRepeat: "no-repeat",
};

const banner1Style = {
    w: { base: "140px", md: "180px", lg: "212px" },
    h: { base: "56px", md: "72px", lg: "85px" },
    aspectRatio: "212/85",
    backgroundImage: "url('/img/match-predict/banner1.png')",
    ...bannerStyle,
};

const banner2Style = {
    h: { base: "110px", md: "160px", lg: "200px" },
    maxW: "600px",
    alignSelf: "center",
    aspectRatio: "3/1",
    backgroundImage: "url('/img/match-predict/banner2.png')",
    ...bannerStyle,
};

const banner3Style = {
    h: { base: "90px", md: "122px", lg: "155px" },
    flexShrink: 0,
    alignSelf: "center",
    aspectRatio: "244/63",
    backgroundImage: "url('/img/match-predict/banner3.png')",
    ...bannerStyle,
};

const titleStyle = {
    w: "190px",
    h: "60px",
    backgroundImage: "url('/img/match-predict/title.png')",
    backgroundColor: "#292E38",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundBlendMode: "lighten",
};

const bannerRowStyle = {
    justify: "center",
    alignItems: "flex-start",
    alignContent: "flex-start",
    gap: "5px",
    alignSelf: "stretch",
    flexWrap: "wrap" as const,
};

const labelStyle = {
    color: "rgba(255, 255, 255, 0.62)",
    fontFamily: "Inter",
    fontSize: { base: "14px", md: "17px", lg: "20px" },
    fontWeight: "400",
};

const linkStyle = {
    bg: "#4A90D9",
    color: "white",
    px: { base: "16px", md: "20px", lg: "24px" },
    py: { base: "8px", md: "9px", lg: "10px" },
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: { base: "14px", md: "16px", lg: "18px" },
    _hover: { bg: "#357ABD" },
    cursor: "pointer",
};

export default function MatchPredictMainPage() {
    const { isLogined } = useAuth();
    const { linkPush } = useLinkPush();

    function handleInputClick() {
        if (!isLogined) {
            sessionStorage.setItem("loginRedirect", "/match-predict/input");
            linkPush("/login");
        } else {
            linkPush("/match-predict/input");
        }
    }

    return (
        <Scroll>
            <Flex w="100%" direction="column" align="center">
                <Flex h="60px" justify="center" align="center" alignSelf="stretch" bg="#292E38">
                    <Box {...titleStyle} />
                </Flex>
                <Flex pb="20px" direction="column" align="center" gap={{ base: "16px", md: "22px", lg: "27px" }} alignSelf="stretch">
                    <Flex direction="column" align="center" gap="3px" alignSelf="stretch">
                        <Flex {...bannerRowStyle}>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Box key={i} {...banner1Style} />
                            ))}
                        </Flex>
                        <Flex {...bannerRowStyle}>
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Box key={i} {...banner1Style} />
                            ))}
                        </Flex>
                        <Box {...banner2Style} />
                    </Flex>

                    <Flex px={{ base: "8px", md: "12px" }} justify="center" alignSelf="stretch">
                        <Stack align="center" gap={{ base: "8px", md: "10px", lg: "12px" }}>
                            <Text {...labelStyle}>- 이번 챔스 결승이 뭐고(psg vs arsenal)</Text>
                            <Text {...labelStyle}>- 채점 기준 알려주고</Text>
                            <Text {...labelStyle}>- 경품 알려주고</Text>
                            <Button onClick={handleInputClick} {...linkStyle}>
                                입력하기
                            </Button>
                        </Stack>
                    </Flex>

                    <Flex maxW="600px" direction="column" align="center" alignSelf="center" aspectRatio="173/134">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Box key={i} {...banner3Style} />
                        ))}
                    </Flex>
                </Flex>
            </Flex>
        </Scroll>
    );
}
