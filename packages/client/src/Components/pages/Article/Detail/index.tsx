"use client"

import { Badge, Card, Flex, Grid, HStack, IconButton, Separator, Spacer, Stack, StackSeparator, Textarea, useBreakpointValue } from "@chakra-ui/react";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import DeleteBtn from "@scspace-client/Components/molecules/buttons/DeleteBtn";
import RefetchBtn from "@scspace-client/Components/molecules/buttons/RefetchBtn";
import ArticleFiles from "@scspace-client/Components/organisms/Article/Read/ArticleFiles";
import ArticleImages from "@scspace-client/Components/organisms/Article/Read/ArticleImages";
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

    const { deleteArticle } = useArticleAPI({ id });

    const [e, setE] = useState<string>("");

    const handleDelete = () => {
        toaster.promise(
            deleteArticle({}, {
                onSuccess: () => {
                    refetch();
                    linkPush("/article");
                },
                onError: (e) => {
                    setE(e.message);
                }
            }),
            {
                loading: {
                    title: "삭제중...",
                },
                success: {
                    title: "삭제되었습니다.",
                    description: "게시글 목록으로 이동합니다.",
                },
                error: {
                    title: "삭제 실패",
                    description: e ?? "다시 시도해주세요.",
                },
            }
        );
    }

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
                            <Card.Title>
                                {data.title}
                            </Card.Title>
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
                    <Separator />
                    <Card.Footer
                        p={0}
                    >
                        <Flex width="100%" justifyContent={"flex-end"}>
                            <DeleteBtn onDelete={handleDelete} />
                        </Flex>
                    </Card.Footer>
                </>) : (<LoadingComponent />)}
            </Card.Root>
        </Grid>
    );
}