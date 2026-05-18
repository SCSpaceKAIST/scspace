import { Flex, Box, Text, Stack, Link } from "@chakra-ui/react";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";

const bannerStyle = {
    backgroundColor: "lightgray",
    backgroundSize: "cover",
    backgroundPosition: "50%",
    backgroundRepeat: "no-repeat",
};

const banner1Style = {
    w: "212px",
    h: "85px",
    aspectRatio: "212/85",
    backgroundImage: "url('/img/match-predict/banner1.png')",
    ...bannerStyle,
};

const banner2Style = {
    h: "200px",
    maxW: "600px",
    alignSelf: "center",
    aspectRatio: "3/1",
    backgroundImage: "url('/img/match-predict/banner2.png')",
    ...bannerStyle,
};

const banner3Style = {
    h: "155px",
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
    fontSize: "20px",
    fontWeight: "400",
};

const linkStyle = {
    bg: "#4A90D9",
    color: "white",
    px: "24px",
    py: "10px",
    borderRadius: "8px",
    fontWeight: "bold",
    _hover: { bg: "#357ABD" },
};

export default function MatchPredictMainPage() {
    return (
        <Scroll>
            <Flex w="100%" direction="column" align="center">
                <Flex h="60px" justify="center" align="center" alignSelf="stretch" bg="#292E38">
                    <Box {...titleStyle} />
                </Flex>
                <Flex pb="20px" direction="column" align="center" gap="27px" alignSelf="stretch">
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

                    <Flex px="12px" justify="center" alignSelf="stretch">
                        <Stack align="center" gap="12px">
                            <Text {...labelStyle}>- 이번 챔스 결승이 뭐고(psg vs arsenal)</Text>
                            <Text {...labelStyle}>- 채점 기준 알려주고</Text>
                            <Text {...labelStyle}>- 경품 알려주고</Text>
                            <Link href="/match-predict/input" {...linkStyle}>
                                예측하기
                            </Link>
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
