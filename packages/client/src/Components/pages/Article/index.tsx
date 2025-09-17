"use client"

import { Box, Button, Card, Flex, Grid, IconButton, Spacer, Stack, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import AddBtn from "@scspace-client/Components/molecules/buttons/AddBtn";
import RefetchBtn from "@scspace-client/Components/molecules/buttons/RefetchBtn";
import CreateArticleDialog from "@scspace-client/Components/organisms/Article/Create/CreateArticleDialog";
import ArticleTable from "@scspace-client/Components/organisms/Article/Read/ArticleTable";
import { useAuth } from "@scspace-client/Hooks/auth";
import { useArticleTypeStore } from "@scspace-client/Store/articleType";
import { ArticleTypeString } from "@scspace-depot/consts/article.const";
import { ArticleTypeEnum } from "@scspace-depot/enums/article.enum";
import { useEffect, useState } from "react";
import { HiMenu } from "react-icons/hi";

export default function Article() {
    const { needLogin } = useAuth();
    needLogin();

    const { open, onToggle } = useDisclosure();

    const { type, update } = useArticleTypeStore();
    useEffect(() => {
        if (!type) {
            update(ArticleTypeEnum.NOTICE);
        }
    }, [type, update]);

    const [refetchCounter, setRefetchCounter] = useState(0);

    const [openCreateDialog, setOpenCreateDialog] = useState(false);

    const isWide = useBreakpointValue({ base: false, md: true });

    return (
        <>
            <CreateArticleDialog open={openCreateDialog} setOpen={setOpenCreateDialog} />
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
                        refetch={() => setRefetchCounter(c => c + 1)}
                    />
                    <AddBtn
                        onClick={() => setOpenCreateDialog(true)}
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
                                    onClick={() => update(Number(key) as ArticleTypeEnum)}
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
                        size={"sm"}
                    >
                        <Card.Header>
                            <Card.Title>
                                {ArticleTypeString[type]}
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <ArticleTable
                                refetchTrigger={refetchCounter}
                                query={{ type }}
                            />
                        </Card.Body>
                    </Card.Root>
                </Flex>
            </Grid>
        </>
    );
}