"use client"

import {
    Box,
    Button,
    Center,
    Field,
    FileUpload,
    HStack,
    IconButton,
    useFileUploadContext,
    UseFileUploadReturn,
} from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { HiX } from "react-icons/hi";
import { LuFileImage } from "react-icons/lu"

function ImageUploadList() {
    const fileUpload = useFileUploadContext();
    const files = fileUpload.acceptedFiles;

    const [select, setSelect] = useState<number>(0);
    useEffect(() => {
        if (select >= files.length) {
            setSelect(files.length - 1);
        } else {
            setSelect(0);
        }
    }, [files]);

    if (files.length === 0) return null;

    return (
        <Center
            overflowX="hidden"
            minH={0}
            w="100%"
            maxW="100%"
            whiteSpace="nowrap"
        >
            <HStack w="fit-content" minWidth="max-content" h="450px">
                <Box
                    key={`empty-before`}
                    w={`${248 * (files.length - select - 1) + 8}px`}
                    // h={'100px'}
                    transition={"all"}
                    transitionDuration={"moderate"}
                // background={"gray.200"}
                />
                {files.map((file, idx) => (
                    <FileUpload.Item
                        w={(select === idx ? "360px" : "240px")}
                        h={(select === idx ? "450px" : "300px")}
                        maxW={"72svw"}
                        maxH={"96svw"}
                        file={file}
                        key={`${file.name}-${idx}`}
                        justifyContent={"center"}
                        alignContent={"center"}
                        onClick={() => setSelect(idx)}
                        transition={"all"}
                        transitionDuration={"moderate"}
                        border={0}
                        background={"gray.50"}
                        p={0}
                    >
                        <FileUpload.ItemPreviewImage
                            maxH={"full"}
                            maxW={"full"}
                        />
                        <Box position={"absolute"} top={2} right={2}>
                            <FileUpload.ItemDeleteTrigger asChild>
                                <IconButton size={"xs"} variant={"ghost"}>
                                    <HiX />
                                </IconButton>
                            </FileUpload.ItemDeleteTrigger>
                        </Box>
                    </FileUpload.Item>
                ))}
                <Box
                    key={`empty-after`}
                    w={`${248 * (select) + 8}px`}
                    // h={'100px'}
                    transition={"all"}
                    transitionDuration={"moderate"}
                // background={"gray.200"}
                />
            </HStack>
        </Center>
    )
}

export default function ArticleImageUpload({ fileUpload }: { fileUpload: UseFileUploadReturn }) {
    return (
        <FileUpload.RootProvider
            value={fileUpload}
        >
            <FileUpload.HiddenInput />
            <Field.Root
                required
                invalid={
                    fileUpload.acceptedFiles &&
                    fileUpload.acceptedFiles.length > 0 &&
                    fileUpload.acceptedFiles[0].size > 10 * 1024 * 1024
                }
            >
                <Field.Label>
                    Images
                    <Field.RequiredIndicator />
                </Field.Label>
                <FileUpload.Trigger asChild>
                    <Button variant="outline" width={"full"}>
                        <LuFileImage /> Upload Images
                    </Button>
                </FileUpload.Trigger>
                <Field.ErrorText>
                    이미지의 크기는 10MB를 초과할 수 없습니다.
                </Field.ErrorText>
            </Field.Root>
            <ImageUploadList />
        </FileUpload.RootProvider>
    )
}
