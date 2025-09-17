"use client"

import { Badge, Button, Dialog, Portal, Stack, useBreakpointValue, useFileUpload } from "@chakra-ui/react";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import { useArticleAPI } from "@scspace-client/Hooks/article";
import { useState } from "react";
import ArticleImageUpload from "../Create/ArticleImageUpload";
import ArticleFileUpload from "../Create/ArticleFileUpload";

export default function ArticleAddFileBtn({ id, refetch }: {
    id: number;
    refetch: () => void;
}) {
    const [open, setOpen] = useState<boolean>(false);

    const imageUpload = useFileUpload({
        maxFiles: 20,
        accept: { "image/*": [] },
    });

    const fileUpload = useFileUpload({
        maxFiles: 20,
    });

    const [error, setError] = useState<string>("");

    const updateArticleFile = useArticleAPI({ id }).updateArticleFile;

    const handleUpload = () => {
        if (imageUpload.acceptedFiles.length === 0 && fileUpload.acceptedFiles.length === 0) {
            toaster.error({
                title: "No files selected."
            });
            return;
        }

        const formData = new FormData();

        imageUpload.acceptedFiles.forEach((file) => {
            formData.append("images", file);
        });

        fileUpload.acceptedFiles.forEach((file) => {
            formData.append("files", file);
        });

        toaster.promise(
            updateArticleFile(formData, {
                onError: (err) => {
                    setError(err.message);
                },
                onSuccess: () => {
                    setOpen(false);
                    imageUpload.clearFiles();
                    fileUpload.clearFiles();
                    refetch();
                }
            }),
            {
                loading: {
                    title: "Uploading files..."
                },
                success: {
                    title: "Article Updated Successfully!"
                },
                error: {
                    title: "Failed to Update Article.",
                    description: error || "Please try again"
                }
            }
        );
    }

    const isWide = useBreakpointValue({ base: false, md: true });

    return (
        <>
            <Badge
                colorPalette="blue"
                variant={{
                    base: "subtle",
                    _hover: "solid"
                }}
                cursor={"pointer"}
                onClick={() => setOpen(true)}
            >
                Add File
            </Badge>
            <Dialog.Root
                open={open}
                onOpenChange={(v) => setOpen(v.open)}
                placement={"center"}
                size={isWide ? "cover" : "full"}
                scrollBehavior="inside"
            >
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>
                                    Add Images or Files
                                </Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <Stack>
                                    <ArticleImageUpload
                                        imageUpload={imageUpload}
                                    />
                                    <ArticleFileUpload
                                        fileUpload={fileUpload}
                                    />
                                </Stack>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Button
                                    colorPalette={"blue"}
                                    disabled={imageUpload.acceptedFiles.length === 0 && fileUpload.acceptedFiles.length === 0}
                                    onClick={handleUpload}
                                >
                                    Confirm
                                </Button>
                                <Dialog.ActionTrigger asChild>
                                    <Button variant={"outline"}>
                                        Cancel
                                    </Button>
                                </Dialog.ActionTrigger>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </>
    );
}