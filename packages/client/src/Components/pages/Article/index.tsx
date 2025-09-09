"use client"

import { Box, Button, Card, Flex, Grid, IconButton, Spacer, Stack, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import AddBtn from "@scspace-client/Components/molecules/buttons/AddBtn";
import RefetchBtn from "@scspace-client/Components/molecules/buttons/RefetchBtn";
import ArticleTable from "@scspace-client/Components/organisms/Article/Read/ArticleTable";
import { ArticleTypeString } from "@scspace-depot/consts/article.const";
import { ArticleTypeEnum } from "@scspace-depot/enums/article.enum";
import { useState } from "react";
import { HiMenu } from "react-icons/hi";

export default function Article() {
    const { open, onToggle } = useDisclosure();
    const [type, setType] = useState<ArticleTypeEnum>(ArticleTypeEnum.NOTICE);

    const isWide = useBreakpointValue({ base: false, md: true });

    return (
        <Grid
            templateRows={"auto 1fr"}
            gap={2}
        >
            <Flex gap={2}>
                <IconButton onClick={onToggle} variant={open ? "surface" : "outline"}>
                    <HiMenu />
                </IconButton>
                <Spacer />
                <RefetchBtn
                    refetch={() => alert('Refetch Articles')}
                />
                <AddBtn
                    onClick={() => alert('Add New Article')}
                />
            </Flex>
            <Flex
                height={"full"}
                width={"full"}
                justify={"end"}
                position={"relative"}
            >
                <Box
                    w={isWide ? "18%" : "full"}
                    h="full"
                    border={open ? "1px" : "none"}
                    position={"absolute"}
                    left={0}
                >
                    <Stack mr={2}>
                        {Object.entries(ArticleTypeString).map(([key, value]) => (
                            <Button
                                variant={(Number(key) === type) ? "subtle" : "ghost"}
                                key={key}
                                onClick={() => setType(Number(key) as ArticleTypeEnum)}
                                colorPalette={(Number(key) === type) ? "blue" : "current"}
                            >
                                {value}
                            </Button>
                        ))}
                    </Stack>
                </Box>
                <Card.Root
                    zIndex={10}
                    width={open ? (isWide ? "82%" : "0") : "full"}
                    transition={"all"}
                    transitionDuration={"moderate"}
                    overflow={"hidden"}
                    borderWidth={open ? (isWide ? "1px" : "0") : "1px"}
                >
                    <Card.Header>
                        <Card.Title>
                            {ArticleTypeString[type]}
                        </Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <ArticleTable type={type} />
                    </Card.Body>
                    <Card.Footer>
                        Footer
                    </Card.Footer>
                </Card.Root>
            </Flex>
        </Grid>
    );
}