"use client"

import {
    Button,
    Field,
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
            <Field.Root required>
                <Field.Label>
                    {fileUpload.acceptedFiles.length > 0 ?
                        fileUpload.acceptedFiles[0].name : "No files selected"}
                    <Field.RequiredIndicator />
                </Field.Label>
                <FileUpload.Trigger asChild>
                    <Button variant="outline" width={"full"}>
                        <LuFileImage /> {fileUpload.acceptedFiles.length > 0 ? "Change Image" : "Upload Image"}
                    </Button>
                </FileUpload.Trigger>
            </Field.Root>
            <FileUploadList />
        </FileUpload.RootProvider>
    )
}
