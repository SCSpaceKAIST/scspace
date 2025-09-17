"use client"

import { Box, Center, HStack, IconButton, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";
import { HiMinus, HiPlus, HiX } from "react-icons/hi";

const localhostBaseURL = "http://localhost:3001/uploads/";

export default function ArticleImages({ editable, images, setImages }: {
    editable: boolean;
    images: string[];
    setImages: (images: string[]) => void;
}) {
    const [select, setSelect] = useState<number>(0);

    if (images.length === 0) return null;

    const exchangeImages = async (from: number, to: number) => {
        if (from < 0 || from >= images.length || to < 0 || to >= images.length) return;
        const newImages = [...images];
        const temp = newImages[from];
        newImages[from] = newImages[to];
        newImages[to] = temp;

        setImages(newImages);
    }

    const deleteImage = (index: number) => {
        if (index < 0 || index >= images.length) return;
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    }

    return (
        <Center
            overflow={"hidden"}
            minH={0}
            w="100%" maxW="100%"
            whiteSpace="nowrap"
        >
            <HStack
                w="fit-content" minW="max-content"
                h={"450px"} maxH={"96svw"}
            >
                <Box
                    key={`empty-before`}
                    w={`${248 * (images.length - select - 1) + 8}px`}
                    // h={'100px'}
                    transition={"all"}
                    transitionDuration={"moderate"}
                // background={"gray.200"}
                />
                {images.map((image, idx) => (
                    <Center
                        w={(select === idx ? "360px" : "240px")}
                        h={(select === idx ? "450px" : "300px")}
                        maxW={"72svw"}
                        maxH={"96svw"}
                        key={`${image}-${idx}`}
                        justifyContent={"center"}
                        alignContent={"center"}
                        onClick={() => setSelect(idx)}
                        transition={"all"}
                        transitionDuration={"moderate"}
                        // background={(select !== idx ? "gray.200" : "transparent")}
                        background={"gray.200"}
                        position={"relative"}
                    >
                        <Image
                            src={image ? `${localhostBaseURL}${image}` : "/img/logo.svg"}
                            alt={`Image ${idx + 1}`}
                            layout="fill"
                            objectFit="contain"
                        />
                        {editable && (<>
                            <Box position={"absolute"} top={2} right={2}>
                                <IconButton
                                    size={"xs"}
                                    variant={"ghost"}
                                    onClick={() => deleteImage(idx)}
                                >
                                    <HiX />
                                </IconButton>
                            </Box>
                            <Box position={"absolute"} bottom={2}
                                display={(idx === select) ? "block" : "none"}
                            >
                                <HStack
                                    backdropFilter="blur(8px)"
                                    background="rgba(255,255,255,0.3)"
                                    rounded={"md"}
                                >
                                    <IconButton
                                        size={"xs"}
                                        variant={"ghost"}
                                        disabled={idx === 0}
                                        onClick={async () => {
                                            exchangeImages(idx, idx - 1).then(() => {
                                                setSelect(idx - 1);
                                            });
                                        }}
                                    >
                                        <HiMinus />
                                    </IconButton>
                                    <Text fontWeight={"semibold"}>
                                        {idx + 1}
                                    </Text>
                                    <IconButton
                                        size={"xs"}
                                        variant={"ghost"}
                                        disabled={idx === images.length - 1}
                                        onClick={async () => {
                                            exchangeImages(idx, idx + 1).then(() => {
                                                setSelect(idx + 1);
                                            });
                                        }}
                                    >
                                        <HiPlus />
                                    </IconButton>
                                </HStack>
                            </Box>
                        </>)}
                    </Center>
                ))}
                <Box
                    key={`empty-after`}
                    w={`${248 * (select) + 8}px`}
                    // h={'100px'}
                    transition={"all"}
                    transitionDuration={"moderate"}
                // background={"gray.200"}
                />
            </HStack>
        </Center>
    );
}