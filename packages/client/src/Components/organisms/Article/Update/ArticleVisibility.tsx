"use client";

import { Switch } from "@chakra-ui/react";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import { useArticleAPI } from "@scspace-client/Hooks/article";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function ArticleVisibility({ visible, id, refetch }: {
    visible: boolean;
    id: number;
    refetch: () => void;
}) {
    const updateArticleVisibility = useArticleAPI({ id }).updateArticleVisibility;
    const [error, setError] = useState<string>("");

    const handleUpdate = (visible: boolean) => {
        toaster.promise(
            updateArticleVisibility({ visible }, {
                onError: (err) => {
                    setError(err.message);
                },
                onSuccess: () => {
                    refetch();
                }
            }),
            {
                loading: {
                    title: "Updating article visibility..."
                },
                success: {
                    title: "Article visibility updated."
                },
                error: {
                    title: "Failed to update article visibility.",
                    description: error
                }
            }
        )
    }

    return (
        <Switch.Root
            defaultChecked={visible}
            onCheckedChange={(v) => handleUpdate(v.checked as boolean)}
        >
            <Switch.HiddenInput />
            <Switch.Control>
                <Switch.Thumb>
                    <Switch.ThumbIndicator fallback={
                        <AiOutlineEyeInvisible />
                    }>
                        <AiOutlineEye />
                    </Switch.ThumbIndicator>
                </Switch.Thumb>
            </Switch.Control>
        </Switch.Root>
    );
}