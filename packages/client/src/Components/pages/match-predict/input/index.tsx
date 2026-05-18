import { Flex, Box, Text, Link } from "@chakra-ui/react";
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

const emblemStyle = {
    w: "90px",
    h: "90px",
    aspectRatio: "1/1",
    bgColor: "black",
    bgPosition: "50%",
    bgSize: "contain",
    bgRepeat: "no-repeat",
};

const scoreBoxStyle = {
    w: "90px",
    h: "90px",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #FFF",
    bg: "rgba(255, 255, 255, 0)",
};

const labelStyle = {
    color: "rgba(255, 255, 255, 0.62)",
    fontFamily: "Inter",
    fontSize: "20px",
    fontWeight: "400",
    alignSelf: "stretch" as const,
    textAlign: "center" as const,
};

const scoreStyle = {
    color: "rgba(255, 255, 255, 0.81)",
    fontFamily: "Inter",
    fontSize: "36px",
    fontWeight: "700",
    textAlign: "center" as const,
};

function ScoreRow() {
    return (
        <Flex justify="center" alignItems="center" gap="300px" alignSelf="stretch">
            <Box display="flex" {...scoreBoxStyle}>
                <Text {...scoreStyle}>2</Text>
            </Box>
            <Text {...scoreStyle}>:</Text>
            <Box display="flex" {...scoreBoxStyle}>
                <Text {...scoreStyle}>2</Text>
            </Box>
        </Flex>
    );
}

function ScoreSection({ label }: { label: string }) {
    return (
        <Flex direction="column" alignItems="center" gap="9px" alignSelf="stretch">
            <Text {...labelStyle}>{label}</Text>
            <ScoreRow />
        </Flex>
    );
}

export default function MatchPredictInputPage() {
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
                        <Flex px="50px" py="24px" direction="column" alignItems="center" gap="40px" flex="1 0 0">
                            <Flex justify="center" alignItems="center" gap="60px" alignSelf="stretch">
                                <Box bgImage="url(/img/match-predict/arsenal.png)" {...emblemStyle} />
                                <Text {...labelStyle} alignSelf="center">VS</Text>
                                <Box bgImage="url(/img/match-predict/psg.png)" {...emblemStyle} />
                            </Flex>
                            <ScoreSection label="전반전 점수" />
                            <ScoreSection label="후반전 점수" />
                            <Flex justify="center" alignItems="center" alignSelf="stretch">
                                <Text {...labelStyle}>Submit</Text>
                            </Flex>
                        </Flex>
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
