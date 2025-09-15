"use client"

import { Button, Wrap } from "@chakra-ui/react";
import { useArticleAPI } from "@scspace-client/Hooks/article";
import { useFileAPI } from "@scspace-client/Hooks/file";

export default function ArticleFiles({ files }: { files: string[] }) {
    if (files.length === 0) return null;

    const downloadFile = useFileAPI().downloadFile;

    return (
        <Wrap>
            {files.map((file, idx) => (
                <Button
                    w={"fit-content"}
                    key={`${file}-${idx}`}
                    variant={"outline"}
                    onClick={() => downloadFile({
                        filename: file,
                        displayName: file.split("_").slice(1).join("_"),
                        isPublic: true,
                    })}
                >
                    {file.split("_").slice(1).join("_")}
                </Button>
            ))}
        </Wrap>
    );
}