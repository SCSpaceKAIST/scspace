"use client"

import { Button, Wrap } from "@chakra-ui/react";
import { useFileAPI } from "@scspace-client/Hooks/file";

export default function ArticleFiles({ files }: { files: string[] }) {
    const downloadFile = useFileAPI().downloadFile;

    if (files.length === 0) return null;

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