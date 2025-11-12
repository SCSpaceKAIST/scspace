"use client"

import { AspectRatio, Badge, Box, Button, Card, Flex, Heading, HStack, Link, Text, Textarea, VStack } from "@chakra-ui/react";
import { dateUtils } from "@scspace-client/Hooks/utils";
import { IArticleWithUser } from "@scspace-depot/types/article";
import { motion } from "framer-motion";
import Image from "next/image";

const MotionDiv = motion.div;
const localhostBaseURL = "http://localhost:3001/uploads/";

export type ArticleCardProps = Pick<IArticleWithUser, "title" | "id" | "content" | "timeUpdate" | "type" | "images"> & {
    index: number;
};

export default function ArticleCard({ title, id, index, content, timeUpdate, type, images }: ArticleCardProps) {
    const getString = dateUtils().getString;
    const image = JSON.parse(images ?? "[]")[0] ?? null;

    return (
        <MotionDiv
            role="group"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: index * 0.07 }}
        >
            <Card.Root
                height="full"
                borderRadius="2xl"
                borderWidth="1px"
                borderColor="gray.200"
                bg="white"
                shadow="lg"
                overflow="hidden"
                transition="all 0.25s ease"
            >
                <Card.Header>
                    <VStack align="flex-start" height="full">
                        <Flex align={"center"} justify={"space-between"} width="full">
                            <Badge alignSelf="flex-start" variant="subtle" colorPalette={"blue"}>
                                {["Notice", "Business", "Promotion"][type]}
                            </Badge>
                            <Card.Description>
                                {getString(timeUpdate)}
                            </Card.Description>
                        </Flex>
                        <Heading size="md" letterSpacing="-0.01em">
                            {title}
                        </Heading>
                    </VStack>
                </Card.Header>
                <Card.Body>
                    <AspectRatio ratio={5 / 4}>
                        <Image
                            src={images ? `${localhostBaseURL}${image}` : "/img/logo.svg"}
                            alt={`Image ${index + 1}`}
                            layout="fill"
                            objectFit="contain"
                        />
                    </AspectRatio>
                    <Textarea
                        value={content ?? ""}
                        readOnly
                        autoresize
                        resize="none"
                    />
                </Card.Body>
                <Card.Footer>
                    <Link href={`/article/${id}`} w="full" _hover={{ textDecoration: "none" }}>
                        <Button size={"sm"} w="full" variant={"outline"} colorPalette={"blue"}>
                            바로가기
                        </Button>
                    </Link>
                </Card.Footer>
            </Card.Root>
        </MotionDiv>
    );
}
