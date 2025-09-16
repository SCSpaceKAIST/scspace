"use client"

import { Badge, Text } from "@chakra-ui/react";
import AlertBtn from "@scspace-client/Components/atoms/AlertBtn";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import { useLinkPush } from "@scspace-client/Hooks/api";
import { useArticleAPI } from "@scspace-client/Hooks/article";
import { useState } from "react";

export default function ArticleDeleteBtn({ id, refetch }: {
    id: number;
    refetch: () => void;
}) {
    const { deleteArticle } = useArticleAPI({ id });
    const { linkPush } = useLinkPush();

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
        <AlertBtn
            onClick={handleDelete}
            colorPalette="red"
            buttonText="Delete"
            dialogTitle="Are you sure?"
            dialogBody={
                <>
                    <Text>
                        This action is permanent and cannot be undone,
                    </Text>
                    <Text>
                        and the data will be completely removed from our systems.
                    </Text>
                </>
            }
        >
            <Badge colorPalette="red" variant={{ base: "subtle", _hover: "solid" }} cursor={"pointer"}>
                Delete
            </Badge>
        </AlertBtn>
    );
}