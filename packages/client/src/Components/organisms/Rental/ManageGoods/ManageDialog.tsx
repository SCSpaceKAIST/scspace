"use client"

import { Button, Dialog, Portal, useFileUpload, VStack } from "@chakra-ui/react";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import { getErrorMessage } from "@scspace-client/Hooks/error";
import { useGoodsAPI } from "@scspace-client/Hooks/rental";
import { useCallback, useEffect, useState } from "react";
import { GoodsNameForm } from "../AddGoods/NameForm";
import { GoodsDescriptionForm } from "../AddGoods/DecsriptionForm";
import { GoodsCountForm } from "../AddGoods/CountForm";
import GoodsImageForm from "../AddGoods/ImageForm";

export default function ManageDialog({ id, onChange }: {
    onChange: () => void;
    id: number;
}) {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [countAll, setCountAll] = useState<number>(0);
    const fileUpload = useFileUpload({
        maxFiles: 1,
        accept: { "image/*": [] },
    });

    const {
        createGoods,
        updateGoods,
        deleteGoods,
        goodsById: {
            data: goodsData,
            refetch: goodsRefetch
        }
    } = useGoodsAPI({ id });

    useEffect(() => {
        if (id !== -1) {
            goodsRefetch();
        }
    }, [id, goodsRefetch]);

    useEffect(() => {
        if (goodsData) {
            setName(goodsData.name);
            setDescription(goodsData.description || '');
            setCountAll(goodsData.countAll);
        } else {
            setName('');
            setDescription('');
            setCountAll(0);
        }
        fileUpload.clearFiles();
    }, [goodsData?.id]);

    const handleCreate = useCallback(() => {
        if (!name) {
            toaster.error({ title: "Name is required" });
            return;
        }
        if (!description) {
            toaster.error({ title: "Description is required" });
            return;
        }
        if (countAll <= 0) {
            toaster.error({ title: "Count must be greater than 0" });
            return;
        }
        if (fileUpload.acceptedFiles.length === 0) {
            toaster.error({ title: "Image is required" });
            return;
        }

        const formData = new FormData();

        formData.append('file', fileUpload.acceptedFiles[0]);
        formData.append('name', name);
        formData.append('description', description || '');
        formData.append('countAll', countAll.toString());

        createGoods(formData)
            .then(() => {
                setName('');
                setDescription('');
                setCountAll(0);
                fileUpload.clearFiles();
                onChange();
                toaster.success({
                    title: "Goods created successfully!",
                    description: "The new goods has been added",
                });
            })
            .catch((error) => {
                console.error('Failed to create goods:', error);
                toaster.error({
                    title: "Failed to create goods",
                    description: getErrorMessage(error, "Please try again"),
                });
            });
    }, [name, description, countAll, createGoods, fileUpload, onChange]);

    const handleUpdate = useCallback(() => {
        const formData = new FormData();

        if (fileUpload.acceptedFiles.length > 0) formData.append('file', fileUpload.acceptedFiles[0]);
        if (name) formData.append('name', name);
        if (description) formData.append('description', description);
        if (countAll) formData.append('countAll', countAll.toString());

        updateGoods(formData)
            .then(() => {
                onChange();
                fileUpload.clearFiles();
                toaster.success({
                    title: "Goods updated successfully!",
                    description: "The goods has been updated",
                });
            })
            .catch((error) => {
                console.error('Failed to update goods:', error);
                toaster.error({
                    title: "Failed to update goods",
                    description: getErrorMessage(error, "Please try again"),
                });
            });
    }, [name, description, countAll, updateGoods, fileUpload, onChange]);

    const handleDelete = useCallback(() => {
        deleteGoods({})
            .then(() => {
                onChange();
                toaster.success({
                    title: "Goods deleted successfully!",
                    description: "The goods has been removed",
                });
            })
            .catch((error) => {
                console.error('Failed to delete goods:', error);
                toaster.error({
                    title: "Failed to delete goods",
                    description: getErrorMessage(error, "Please try again"),
                });
            });
    }, [deleteGoods, onChange]);

    return (
        <Dialog.Root
            placement={"center"}
            scrollBehavior={"inside"}
        >
            <Dialog.Trigger asChild>
                <Button variant={"outline"}>
                    {(id !== -1) ? "Manage" : "Create"}
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop>
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>
                                    {(id !== -1) ? "Manage Items" : "Create Items"}
                                </Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <VStack gap={8} py={4}>
                                    <GoodsNameForm
                                        name={name}
                                        setName={setName}
                                    />
                                    <GoodsDescriptionForm
                                        description={description}
                                        setDescription={setDescription}
                                    />
                                    <GoodsCountForm
                                        count={countAll}
                                        setCount={setCountAll}
                                    />
                                    <GoodsImageForm fileUpload={fileUpload} />
                                </VStack>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Dialog.ActionTrigger asChild>
                                    <Button variant={"outline"}>
                                        Close
                                    </Button>
                                </Dialog.ActionTrigger>
                                {(id !== -1) ? (
                                    <>
                                        <Button
                                            onClick={handleUpdate}
                                            colorPalette={"blue"}
                                        >
                                            Update
                                        </Button>
                                        <Dialog.ActionTrigger asChild>
                                            <Button
                                                onClick={handleDelete}
                                                colorPalette={"red"}
                                            >
                                                Delete
                                            </Button>
                                        </Dialog.ActionTrigger>
                                    </>
                                ) : (
                                    <Button
                                        onClick={handleCreate}
                                        colorPalette={"green"}
                                    >
                                        Create
                                    </Button>
                                )}
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Dialog.Backdrop>
            </Portal>
        </Dialog.Root>
    );
}
