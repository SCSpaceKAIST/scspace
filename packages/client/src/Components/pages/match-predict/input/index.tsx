"use client";

import { Flex, Box, Text, Input, Button } from "@chakra-ui/react";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import { useLinkPush } from "@scspace-client/Hooks/api";
import { useMatchAPI, useMatchPredictionAPI } from "@scspace-client/Hooks/match";
import { useEffect, useState } from "react";

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

const emblemStyle = {
    w: { base: "60px", md: "75px", lg: "90px" },
    h: { base: "60px", md: "75px", lg: "90px" },
    aspectRatio: "1/1",
    bgColor: "black",
    bgPosition: "50%",
    bgSize: "contain",
    bgRepeat: "no-repeat",
};

const scoreBoxStyle = {
    w: { base: "60px", md: "75px", lg: "90px" },
    h: { base: "60px", md: "75px", lg: "90px" },
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #FFF",
    bg: "rgba(255, 255, 255, 0)",
};

const labelStyle = {
    color: "rgba(255, 255, 255, 0.62)",
    fontFamily: "Inter",
    fontSize: { base: "14px", md: "17px", lg: "20px" },
    fontWeight: "400",
    alignSelf: "stretch" as const,
    textAlign: "center" as const,
};

const scoreStyle = {
    color: "rgba(255, 255, 255, 0.81)",
    fontFamily: "Inter",
    fontSize: { base: "24px", md: "30px", lg: "36px" },
    fontWeight: "700",
    textAlign: "center" as const,
};

const SCORE_GAP = { base: "40px", md: "110px", lg: "180px" };

function ScoreInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <Box display="flex" {...scoreBoxStyle}>
            <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={value}
                onChange={(e) => {
                    const v = e.target.value;
                    if (v === "" || /^\d+$/.test(v)) onChange(v);
                }}
                w="full"
                h="full"
                p="0"
                bg="transparent"
                border="none"
                boxShadow="none"
                outline="none"
                _focus={{ boxShadow: "none", border: "none" }}
                color={scoreStyle.color}
                fontFamily={scoreStyle.fontFamily}
                fontSize={scoreStyle.fontSize}
                fontWeight={scoreStyle.fontWeight}
                textAlign="center"
            />
        </Box>
    );
}

function ScoreRow({ valueA, valueB, onChangeA, onChangeB }: {
    valueA: string;
    valueB: string;
    onChangeA: (v: string) => void;
    onChangeB: (v: string) => void;
}) {
    return (
        <Flex justify="center" alignItems="center" gap={SCORE_GAP} alignSelf="stretch">
            <ScoreInput value={valueA} onChange={onChangeA} />
            <Text {...scoreStyle}>:</Text>
            <ScoreInput value={valueB} onChange={onChangeB} />
        </Flex>
    );
}

function ScoreSection({ label, valueA, valueB, onChangeA, onChangeB }: {
    label: string;
    valueA: string;
    valueB: string;
    onChangeA: (v: string) => void;
    onChangeB: (v: string) => void;
}) {
    return (
        <Flex direction="column" alignItems="center" gap="9px" alignSelf="stretch">
            <Text {...labelStyle}>{label}</Text>
            <ScoreRow valueA={valueA} valueB={valueB} onChangeA={onChangeA} onChangeB={onChangeB} />
        </Flex>
    );
}

const TEST_USER_ID = 1;

export default function MatchPredictInputPage() {
    const { linkPush } = useLinkPush();
    const { allMatches, createPrediction } = useMatchAPI();
    const { myPredictions } = useMatchPredictionAPI(TEST_USER_ID);

    const [firstA, setFirstA] = useState("");
    const [firstB, setFirstB] = useState("");
    const [secondA, setSecondA] = useState("");
    const [secondB, setSecondB] = useState("");

    const matchId = allMatches.data?.data?.[0]?.id;
    const existingPrediction = myPredictions.data?.find(
        (p) => p.prediction.matchId === matchId
    );
    const hasSubmitted = !!existingPrediction;

    useEffect(() => {
        if (!existingPrediction) return;
        setFirstA(String(existingPrediction.prediction.firstScoreA));
        setFirstB(String(existingPrediction.prediction.firstScoreB));
        setSecondA(String(existingPrediction.prediction.secondScoreA));
        setSecondB(String(existingPrediction.prediction.secondScoreB));
    }, [existingPrediction]);

    function handleSubmit() {
        if (!matchId) return;
        if ([firstA, firstB, secondA, secondB].some((v) => v === "")) {
            alert("모든 점수를 입력해주세요.");
            return;
        }

        createPrediction({
            userId: TEST_USER_ID,
            matchId,
            firstScoreA: Number(firstA),
            firstScoreB: Number(firstB),
            secondScoreA: Number(secondA),
            secondScoreB: Number(secondB),
        }, {
            onSuccess: () => {
                alert("예측이 제출되었습니다!");
                linkPush("/match-predict/main");
            },
            onError: (e) => {
                alert(e.message);
            },
        });
    }

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

                    <Flex px={{ base: "4px", md: "12px" }} justify="center" alignSelf="stretch">
                        <Flex px={{ base: "16px", md: "32px", lg: "50px" }} py={{ base: "16px", md: "20px", lg: "24px" }} direction="column" alignItems="center" gap={{ base: "24px", md: "32px", lg: "40px" }} flex="1 0 0">
                            <Flex justify="center" alignItems="center" gap={SCORE_GAP} alignSelf="stretch">
                                <Box bgImage="url(/img/match-predict/arsenal.png)" {...emblemStyle} />
                                <Text {...labelStyle} alignSelf="center">VS</Text>
                                <Box bgImage="url(/img/match-predict/psg.png)" {...emblemStyle} />
                            </Flex>
                            <ScoreSection
                                label="전반전 점수"
                                valueA={firstA} valueB={firstB}
                                onChangeA={hasSubmitted ? () => {} : setFirstA}
                                onChangeB={hasSubmitted ? () => {} : setFirstB}
                            />
                            <ScoreSection
                                label="후반전 점수"
                                valueA={secondA} valueB={secondB}
                                onChangeA={hasSubmitted ? () => {} : setSecondA}
                                onChangeB={hasSubmitted ? () => {} : setSecondB}
                            />
                            {!hasSubmitted && (
                                <Button
                                    px="30px"
                                    color={labelStyle.color}
                                    fontFamily={labelStyle.fontFamily}
                                    fontSize={labelStyle.fontSize}
                                    fontWeight={labelStyle.fontWeight}
                                    bg="rgba(255, 255, 255, 0.1)"
                                    border="1px solid rgba(255, 255, 255, 0.3)"
                                    borderRadius="md"
                                    _hover={{ bg: "rgba(255, 255, 255, 0.2)" }}
                                    _active={{ bg: "rgba(255, 255, 255, 0.15)" }}
                                    onClick={handleSubmit}
                                    isLoading={allMatches.isLoading || myPredictions.isLoading}
                                >
                                    Submit
                                </Button>
                            )}
                            {hasSubmitted && (
                                <Button
                                    px="30px"
                                    color="rgba(255, 255, 255, 0.4)"
                                    fontFamily={labelStyle.fontFamily}
                                    fontSize={labelStyle.fontSize}
                                    fontWeight={labelStyle.fontWeight}
                                    bg="rgba(255, 255, 255, 0.05)"
                                    border="1px solid rgba(255, 255, 255, 0.15)"
                                    borderRadius="md"
                                    isDisabled
                                    cursor="not-allowed"
                                >
                                    제출 완료
                                </Button>
                            )}
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
