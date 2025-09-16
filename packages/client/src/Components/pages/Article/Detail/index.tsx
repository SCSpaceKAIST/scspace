"use client"

import { Badge, Card, Flex, Grid, HStack, IconButton, Separator, Spacer, Stack, StackSeparator, Textarea, useBreakpointValue } from "@chakra-ui/react";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import DeleteBtn from "@scspace-client/Components/molecules/buttons/DeleteBtn";
import RefetchBtn from "@scspace-client/Components/molecules/buttons/RefetchBtn";
import ArticleDeleteBtn from "@scspace-client/Components/organisms/Article/Delete/ArticleDeleteBtn";
import ArticleFiles from "@scspace-client/Components/organisms/Article/Read/ArticleFiles";
import ArticleImages from "@scspace-client/Components/organisms/Article/Read/ArticleImages";
import ArticleUpdateBtn from "@scspace-client/Components/organisms/Article/Update/ArticleUpdateBtn";
import { useLinkPush } from "@scspace-client/Hooks/api";
import { useArticleAPI } from "@scspace-client/Hooks/article";
import { ArticleTypeString } from "@scspace-depot/consts/article.const";
import { useState } from "react";
import { HiHome } from "react-icons/hi";

export default function ArticleDetail({ id }: { id: number }) {
    const { data, refetch } = useArticleAPI({ id }).articleById;

    const { linkPush } = useLinkPush();
    const images: string[] = JSON.parse(data?.images ?? "[]");
    const files: string[] = JSON.parse(data?.files ?? "[]");

    const isWide = useBreakpointValue({ base: false, md: true });

    return (
        <Grid
            templateRows={isWide ? "auto 1fr" : "auto auto 1fr"}
            height="100%"
            minH={0}
            maxH={"100%"}
            gap={2}
        >
            <Flex gap={2}>
                <IconButton
                    onClick={() => linkPush("/article")}
                    variant={"outline"}
                >
                    <HiHome />
                </IconButton>
                <Spacer />
                <RefetchBtn refetch={refetch} />
            </Flex>

            {!isWide && <Separator />}
            <Card.Root
                minH={0}
                maxH={"100%"}
                height="100%"
                overflow="hidden"
                gap={4}
                p={isWide ? 4 : 0}
                borderWidth={isWide ? "1px" : "0"}
                background={isWide ? "white" : "transparent"}
                size={"sm"}
            >
                {data ? (<>
                    <Card.Header p={0}>
                        <HStack>
                            <Badge colorPalette={"blue"}>
                                {ArticleTypeString[data.type as keyof typeof ArticleTypeString]}
                            </Badge>
                            <Card.Title truncate>
                                {data.title}
                            </Card.Title>
                            <Spacer />
                            <ArticleUpdateBtn onClick={() => {
                                toaster.info({ title: "준비중입니다." });
                            }} />
                            <ArticleDeleteBtn id={id} refetch={refetch} />
                        </HStack>
                    </Card.Header>
                    <Separator />
                    <Card.Body
                        p={0}
                        flex={1}
                        minH={0}
                        overflowY="auto"
                        scrollBehavior="smooth"
                        scrollbar="hidden"
                    >
                        <Stack separator={<StackSeparator />}>
                            <ArticleImages images={images} />
                            <Textarea
                                readOnly
                                variant={"flushed"}
                                autoresize
                                cursor={"default"}
                                defaultValue={data.content ?? ""}
                                border={0}
                                outlineColor={"transparent"}
                                _focus={{
                                    outline: "none",
                                    boxShadow: "none",
                                    borderColor: "transparent"
                                }}
                            />
                            <ArticleFiles files={files} />
                        </Stack>
                    </Card.Body>
                </>) : (<LoadingComponent />)}
            </Card.Root>
        </Grid>
    );
}