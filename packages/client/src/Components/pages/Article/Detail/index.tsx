"use client"

import { Badge, Card, Flex, Grid, HStack, IconButton, Input, Separator, Spacer, Stack, StackSeparator, Textarea, useBreakpointValue } from "@chakra-ui/react";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import TooltipComponent from "@scspace-client/Components/atoms/Tooptip";
import RefetchBtn from "@scspace-client/Components/molecules/buttons/RefetchBtn";
import ArticleDeleteBtn from "@scspace-client/Components/organisms/Article/Delete/ArticleDeleteBtn";
import ArticleFiles from "@scspace-client/Components/organisms/Article/Read/ArticleFiles";
import ArticleImages from "@scspace-client/Components/organisms/Article/Read/ArticleImages";
import ArticleAddFileBtn from "@scspace-client/Components/organisms/Article/Update/ArticleAddFileBtn";
import ArticleTypeUpdate from "@scspace-client/Components/organisms/Article/Update/ArticleTypeUpdate";
import ArticleUpdateBtn from "@scspace-client/Components/organisms/Article/Update/ArticleUpdateBtn";
import ArticleVisibility from "@scspace-client/Components/organisms/Article/Update/ArticleVisibility";
import { useLinkPush } from "@scspace-client/Hooks/api";
import { useArticleAPI } from "@scspace-client/Hooks/article";
import { useAuth } from "@scspace-client/Hooks/auth";
import { ArticleTypeString } from "@scspace-depot/consts/article.const";
import { ArticleStateEnum, ArticleTypeEnum } from "@scspace-depot/enums/article.enum";
import { useEffect, useState } from "react";
import { HiHome, HiOutlinePencilAlt } from "react-icons/hi";

export default function ArticleDetail({ id }: { id: number }) {
    const { userInfo } = useAuth();

    const { data, refetch, isError, isLoadingError, isRefetchError } = useArticleAPI({ id }).articleById;

    const { linkPush } = useLinkPush();
    const [images, setImages] = useState<string[]>([]);
    const [files, setFiles] = useState<string[]>([]);

    const isWide = useBreakpointValue({ base: false, md: true });

    const [updating, setUpdating] = useState<boolean>(false);
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
            setImages(JSON.parse(data.images ?? "[]"));
            setFiles(JSON.parse(data.files ?? "[]"));
        }
    }, [data, editable]);

    const updateArticle = useArticleAPI({ id }).updateArticle;

    useEffect(() => {
        if (isError || isLoadingError || isRefetchError) {
            toaster.error({
                title: "Failed to load article details.",
                description: "The article may have been deleted or is inaccessible."
            });
            linkPush("/article");
        }
    }, [isError, isLoadingError, isRefetchError, linkPush]);

    const handleUpdate = () => {
        if (!title.trim() || !content.trim()) {
            toaster.error({
                title: "Title and Content cannot be empty."
            });
            return;
        }

        toaster.promise(
            updateArticle({
                title,
                content,
                type,
                images: JSON.stringify(images),
                files: JSON.stringify(files)
            }, {
                onError: (err) => {
                    setError(err.message);
                },
                onSuccess: (res) => {
                    setEditable(false);

                    setTitle(res.title ?? "");
                    setContent(res.content ?? "");
                    setType(res.type ?? ArticleTypeEnum.NOTICE);
                    setImages(JSON.parse(res.images ?? "[]"));
                    setFiles(JSON.parse(res.files ?? "[]"));
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
            <Stack>
                <Flex gap={2}>
                    <IconButton
                        onClick={() => linkPush("/article")}
                        variant={"outline"}
                        size={"xs"}
                    >
                        <HiHome />
                    </IconButton>
                    <Spacer />
                    {(userInfo?.id === data?.userId) && (
                        <TooltipComponent content="Refresh">
                            <IconButton
                                rounded="sm"
                                variant={updating ? "surface" : "ghost"}
                                onClick={() => setUpdating(u => !u)}
                                size={"xs"}
                            >
                                <HiOutlinePencilAlt color="gray" />
                            </IconButton>
                        </TooltipComponent>
                    )}
                    <RefetchBtn refetch={refetch} size={"xs"} />
                </Flex>
                {updating && (
                    <Stack>
                        <ArticleVisibility
                            state={data?.state as ArticleStateEnum}
                            id={id}
                            refetch={refetch}
                        />
                        <Flex justify={"end"} gap={2}>
                            <ArticleUpdateBtn
                                editable={editable}
                                setEditable={setEditable}
                                handleUpdate={handleUpdate}
                            />
                            <ArticleAddFileBtn id={id} refetch={refetch} />
                            <ArticleDeleteBtn id={id} refetch={refetch} />
                        </Flex>
                    </Stack>
                )}
                {editable && (
                    <ArticleTypeUpdate type={type} setType={setType} />
                )}
            </Stack>

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
                                height={"fit-content"}
                                p={1}
                                truncate
                            />
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
                            {images.length > 0 && (
                                <ArticleImages
                                    editable={editable}
                                    images={images}
                                    setImages={setImages}
                                />
                            )}
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
                            {files.length > 0 && (
                                <ArticleFiles
                                    files={files}
                                    setFiles={setFiles}
                                    editable={editable}
                                />
                            )}
                        </Stack>
                    </Card.Body>
                </>) : (<LoadingComponent />)}
            </Card.Root>
        </Grid>
    );
}
