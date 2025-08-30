"use client"

import {
    Button,
    FileUpload,
    useFileUploadContext,
    UseFileUploadReturn,
} from "@chakra-ui/react"
import { LuFileImage } from "react-icons/lu"

function FileUploadList() {
    const fileUpload = useFileUploadContext();
    const files = fileUpload.acceptedFiles;
    if (files.length === 0) return null;
    return (
        <FileUpload.ItemGroup>
            {files.map((file) => (
                <FileUpload.Item
                    w="full"
                    p="4"
                    file={file}
                    key={file.name}
                    justifyContent={"center"}
                    alignContent={"center"}
                >
                    <FileUpload.ItemPreviewImage />
                </FileUpload.Item>
            ))}
        </FileUpload.ItemGroup>
    )
}

export default function GoodsImageForm({ fileUpload }: { fileUpload: UseFileUploadReturn }) {
    return (
        <FileUpload.RootProvider value={fileUpload}>
            <FileUpload.HiddenInput />
            <FileUpload.Trigger asChild>
                <Button variant="outline" width={"full"}>
                    <LuFileImage /> Upload Images
                </Button>
            </FileUpload.Trigger>
            <FileUploadList />
        </FileUpload.RootProvider>
    )
}
