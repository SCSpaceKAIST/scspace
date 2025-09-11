"use client"

import { Badge, Card, Flex, Grid, HStack, IconButton, Spacer, Stack, Textarea } from "@chakra-ui/react";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import RefetchBtn from "@scspace-client/Components/molecules/buttons/RefetchBtn";
import ArticleImages from "@scspace-client/Components/organisms/Article/Read/ArticleImages";
import { useLinkPush } from "@scspace-client/Hooks/api";
import { useArticleAPI } from "@scspace-client/Hooks/article";
import { ArticleTypeString } from "@scspace-depot/consts/article.const";
import { HiHome } from "react-icons/hi";

export default function ArticleDetail({ id }: { id: number }) {
    const { data, refetch } = useArticleAPI({ id }).articleById;

    const { linkPush } = useLinkPush();
    const images: string[] = JSON.parse(data?.images ?? "[]");

    return (
        <Grid
            templateRows={"auto 1fr"}
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

            <Card.Root
                minH={0}
                maxH={"100%"}
                height="100%"
                overflow="hidden"
            >
                {data ? (<>
                    <Card.Header>
                        <HStack>
                            <Badge colorPalette={"blue"}>
                                {ArticleTypeString[data.type as keyof typeof ArticleTypeString]}
                            </Badge>
                            <Card.Title>
                                {data.title}
                            </Card.Title>
                        </HStack>
                    </Card.Header>
                    <Card.Body
                        flex={1}
                        minH={0}
                        overflowY="auto"
                        scrollBehavior="smooth"
                        scrollbar="hidden"
                    >
                        <Stack>
                            <ArticleImages images={images} />
                            <Textarea
                                readOnly
                                variant={"flushed"}
                                autoresize
                                cursor={"default"}
                                defaultValue={data.content ?? ""}
                            />
                        </Stack>
                    </Card.Body>
                </>) : (<LoadingComponent />)}
            </Card.Root>
        </Grid>
    );
}