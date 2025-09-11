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
                {Array.from({ length: images.length }).map((_, idx) => (
                    <Box
                        key={`empty-${idx}-before`}
                        w={idx < images.length - select - 1 ? "240px" : "0"}
                        transition={"all"}
                        transitionDuration={"moderate"}
                    />
                ))}
                {images.map((image, idx) => (
                    <Box
                        w={(select === idx ? "360px" : "240px")}
                        h={(select === idx ? "450px" : "300px")}
                        maxW={"full"}
                        key={`${image}-${idx}`}
                        justifyContent={"center"}
                        alignContent={"center"}
                        onClick={() => setSelect(idx)}
                        transition={"all"}
                        transitionDuration={"moderate"}
                        background={"gray.50"}
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
                {Array.from({ length: images.length }).map((_, idx) => (
                    <Box
                        key={`empty-${idx}-after`}
                        w={idx < select ? "240px" : "0"}
                        transition={"all"}
                        transitionDuration={"moderate"}
                    />
                ))}
            </HStack>
        </Center>
    );
}