"use client"

import { Badge, Card, Flex, Grid, HStack, IconButton, Input, Separator, Spacer, Stack, StackSeparator, Textarea, useBreakpointValue } from "@chakra-ui/react";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import RefetchBtn from "@scspace-client/Components/molecules/buttons/RefetchBtn";
import ArticleDeleteBtn from "@scspace-client/Components/organisms/Article/Delete/ArticleDeleteBtn";
import ArticleFiles from "@scspace-client/Components/organisms/Article/Read/ArticleFiles";
import ArticleImages from "@scspace-client/Components/organisms/Article/Read/ArticleImages";
import ArticleUpdateBtn from "@scspace-client/Components/organisms/Article/Update/ArticleUpdateBtn";
import { useLinkPush } from "@scspace-client/Hooks/api";
import { useArticleAPI } from "@scspace-client/Hooks/article";
import { ArticleTypeString } from "@scspace-depot/consts/article.const";
import { ArticleTypeEnum } from "@scspace-depot/enums/article.enum";
import { useEffect, useState } from "react";
import { HiHome } from "react-icons/hi";

export default function ArticleDetail({ id }: { id: number }) {
    const { data, refetch } = useArticleAPI({ id }).articleById;

    const { linkPush } = useLinkPush();
    const images: string[] = JSON.parse(data?.images ?? "[]");
    const files: string[] = JSON.parse(data?.files ?? "[]");

    const isWide = useBreakpointValue({ base: false, md: true });

    const [editable, setEditable] = useState<boolean>(false);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [type, setType] = useState<ArticleTypeEnum>(ArticleTypeEnum.NOTICE);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (data) {
            setTitle(data.title ?? "");
            setContent(data.content ?? "");
            setType(data.type ?? ArticleTypeEnum.NOTICE);
        }
    }, [data]);

    const updateArticle = useArticleAPI({ id }).updateArticle;

    const handleUpdate = () => {
        if (!title.trim() || !content.trim()) {
            toaster.error({
                title: "Title and Content cannot be empty."
            });
            return;
        }

        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("content", content.trim());
        formData.append("type", type.toString());

        // imageUpload.acceptedFiles.forEach((file) => {
        //     formData.append("images", file);
        // });

        // fileUpload.acceptedFiles.forEach((file) => {
        //     formData.append("files", file);
        // });

        toaster.promise(
            updateArticle(formData, {
                onError: (err) => {
                    setError(err.message);
                },
                onSuccess: () => {
                    setTitle("");
                    setContent("");
                    setEditable(false);
                }
            }),
            {
                loading: {
                    title: "Creating Article..."
                },
                success: {
                    title: "Article Created Successfully!"
                },
                error: {
                    title: "Failed to Create Article.",
                    description: error || "Please try again"
                }
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
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                readOnly={!editable}
                                variant={editable ? "outline" : "flushed"}
                                cursor={"default"}
                                borderWidth={editable ? "1px" : 0}
                                outlineColor={editable ? "gray.300" : "transparent"}
                                _focus={!editable ? {
                                    outline: "none",
                                    boxShadow: "none",
                                    borderColor: "transparent"
                                } : undefined}
                                fontSize={"lg"}
                                fontWeight={"semibold"}
                            />
                            <Spacer />
                            <ArticleUpdateBtn
                                editable={editable}
                                setEditable={setEditable}
                                handleUpdate={handleUpdate}
                            />
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
                                readOnly={!editable}
                                variant={editable ? "outline" : "flushed"}
                                autoresize
                                cursor={"default"}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                borderWidth={editable ? "1px" : 0}
                                outlineColor={editable ? "gray.300" : "transparent"}
                                _focus={!editable ? {
                                    outline: "none",
                                    boxShadow: "none",
                                    borderColor: "transparent"
                                } : undefined}
                            />
                            <ArticleFiles files={files} />
                        </Stack>
                    </Card.Body>
                </>) : (<LoadingComponent />)}
            </Card.Root>
        </Grid>
    );
}