"use client"

import { Box, Center, HStack } from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";

const localhostBaseURL = "http://localhost:3001/uploads/";

export default function ArticleImages({ images }: { images: string[] }) {
    const [select, setSelect] = useState<number>(0);

    return (
        <Center overflow={"hidden"} minH={0} w="100%" maxW="100%" whiteSpace="nowrap">
            <HStack w="fit-content" minWidth="max-content" h="450px">
                <Box
                    key={`empty-before`}
                    w={`${248 * (images.length - select - 1) + 8}px`}
                    // h={'100px'}
                    transition={"all"}
                    transitionDuration={"moderate"}
                // background={"gray.200"}
                />
                {images.map((image, idx) => (
                    <Box
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
                        background={(select !== idx ? "gray.200" : "transparent")}
                        position={"relative"}
                    >
                        <Image
                            src={image ? `${localhostBaseURL}${image}` : "/img/logo.svg"}
                            alt={`Image ${idx + 1}`}
                            layout="fill"
                            objectFit="contain"
                        />
                    </Box>
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