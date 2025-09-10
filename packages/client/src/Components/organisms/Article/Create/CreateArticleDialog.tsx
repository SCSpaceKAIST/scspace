"use client"

import { Button, Dialog, Stack } from "@chakra-ui/react";
import SimpleDialog from "@scspace-client/Components/atoms/SimpleDialog";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import InputComponent from "@scspace-client/Components/molecules/forms/Input";
import SelectComponent from "@scspace-client/Components/molecules/forms/Select";
import TextareaComponent from "@scspace-client/Components/molecules/forms/Textarea";
import { useArticleAPI } from "@scspace-client/Hooks/article";
import { ArticleTypeEnum } from "@scspace-depot/enums/article.enum";
import { useState, Dispatch, SetStateAction } from "react";

export default function CreateArticleDialog({ open, setOpen }: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [type, setType] = useState<ArticleTypeEnum>(ArticleTypeEnum.NOTICE);

    const [error, setError] = useState<string>("");

    const createArticle = useArticleAPI().createArticle;

    const handleCreate = () => {
        if (!title.trim() || !content.trim()) {
            toaster.error({
                title: "Title and Content cannot be empty."
            });
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("type", type.toString());

        toaster.promise(
            createArticle(formData, {
                onError: (err) => {
                    setError(err.message);
                },
                onSuccess: () => {
                    setTitle("");
                    setContent("");
                    setOpen(false);
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
        <SimpleDialog open={open} setOpen={setOpen}>
            <Dialog.Header>
                <Dialog.Title>
                    Create New Article
                </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
                <Stack>
                    <SelectComponent
                        label="Type"
                        onChange={(e) => setType(parseInt(e.value))}
                        defaultValue={type.toString()}
                        optionList={[
                            { value: ArticleTypeEnum.NOTICE.toString(), label: "Notice" },
                            { value: ArticleTypeEnum.GENERAL.toString(), label: "General" },
                            { value: ArticleTypeEnum.BUSINESS.toString(), label: "Business" },
                            { value: ArticleTypeEnum.PROMOTION.toString(), label: "Promotion" }
                        ]}
                        inDialog
                    />
                    <InputComponent
                        label="Title"
                        placeholder="Enter Title"
                        value={title}
                        onChange={setTitle}
                        required={true}
                    />
                    <TextareaComponent
                        label="Content"
                        placeholder="Enter Content"
                        value={content}
                        onChange={setContent}
                        required={true}
                    />
                </Stack>
            </Dialog.Body>
            <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                    <Button variant={"outline"}>
                        Cancel
                    </Button>
                </Dialog.ActionTrigger>
                <Button colorPalette={"blue"} onClick={handleCreate}>
                    Create
                </Button>
            </Dialog.Footer>
        </SimpleDialog>
    );
}