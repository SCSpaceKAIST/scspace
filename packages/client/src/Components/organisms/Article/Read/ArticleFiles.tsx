"use client"

import { Button, ButtonGroup, HStack, IconButton, Wrap } from "@chakra-ui/react";
import { useFileAPI } from "@scspace-client/Hooks/file";
import { HiX } from "react-icons/hi";

export default function ArticleFiles({ files, setFiles, editable }: {
    files: string[];
    setFiles?: (files: string[]) => void;
    editable?: boolean;
}) {
    const downloadFile = useFileAPI().downloadFile;

    if (files.length === 0) return null;

    const deleteFile = (index: number) => {
        if (!editable || !setFiles) return;
        if (index < 0 || index >= files.length) return;
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    }

    return (
        <Wrap>
            {files.map((file, idx) => (
                <ButtonGroup
                    borderWidth={"1px"}
                    rounded={"sm"}
                    key={`${file}-${idx}`}
                    variant={"ghost"}
                    attached
                    size={"sm"}
                >
                    <Button
                        w={"fit-content"}
                        onClick={editable ? undefined : () => downloadFile({
                            filename: file,
                            displayName: file.split("_").slice(1).join("_"),
                            isPublic: true,
                        })}
                    >
                        {file.split("_").slice(1).join("_")}
                    </Button>
                    {editable && (
                        <IconButton onClick={() => deleteFile(idx)}>
                            <HiX />
                        </IconButton>
                    )}
                </ButtonGroup>
            ))}
        </Wrap>
    );
}