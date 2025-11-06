"use client";

import { Flex, RadioGroup } from "@chakra-ui/react";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import { useArticleAPI } from "@scspace-client/Hooks/article";
import { ArticleStateEnum } from "@scspace-depot/enums/article.enum";
import { useState } from "react";

export default function ArticleVisibility({ state, id, refetch }: {
    state: ArticleStateEnum;
    id: number;
    refetch: () => void;
}) {
    const updateArticleState = useArticleAPI({ id }).updateArticleState;
    const [error, setError] = useState<string>("");

    const handleUpdate = (state: ArticleStateEnum) => {
        toaster.promise(
            updateArticleState({ state }, {
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

    const text = ["숨기기", "KAIST 공개", "전체 공개"];

    return (
        <RadioGroup.Root
            value={state.toString()}
            onValueChange={(target) => handleUpdate(Number(target.value) as ArticleStateEnum)}
        >
            <Flex justify={"start"} gap={4}>
                {[
                    ArticleStateEnum.HIDE,
                    ArticleStateEnum.FOR_KAIST,
                    ArticleStateEnum.FOR_ALL
                ].map((enumValue) => (
                    <RadioGroup.Item
                        key={enumValue}
                        value={enumValue.toString()}
                    >
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemIndicator />
                        <RadioGroup.Label>
                            {text[enumValue]}
                        </RadioGroup.Label>
                    </RadioGroup.Item>
                ))}
            </Flex>
        </RadioGroup.Root>
    );
}