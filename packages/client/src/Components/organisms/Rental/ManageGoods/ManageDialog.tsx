"use client"

import { Button, Dialog, Portal, VStack } from "@chakra-ui/react";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import { useGoodsAPI } from "@scspace-client/Hooks/rental";
import { IGoodsCreate } from "@scspace-depot/types/rental/goods.type";
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
    const [errorMessage, setErrorMessage] = useState<string>('');

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
        }
    }, [goodsData]);

    const handleCreate = useCallback(() => {
        const formData: IGoodsCreate = {
            name,
            description: description || null,
            countAll,
            imageId: 1, // 임시로 기본값 설정
        };

        toaster.promise(
            createGoods(formData, {
                onError: (error) => {
                    setErrorMessage(error.message || 'Failed to create goods');
                    console.error('Failed to create goods:', error);
                },
                onSuccess: () => {
                    setName('');
                    setDescription('');
                    setCountAll(0);
                    setErrorMessage('');
                    onChange();
                }
            }),
            {
                loading: {
                    title: "Creating goods...",
                    description: "Please wait",
                },
                success: {
                    title: "Goods created successfully!",
                    description: "The new goods has been added",
                },
                error: {
                    title: "Failed to create goods",
                    description: errorMessage || "Please try again"
                }
            }
        );
    }, [name, description, countAll, createGoods, errorMessage]);

    const handleUpdate = useCallback(() => {
        const formData: IGoodsCreate = {
            name,
            description: description || null,
            countAll,
            imageId: 1, // 임시로 기본값 설정
        };

        toaster.promise(
            updateGoods(formData, {
                onError: (error) => {
                    setErrorMessage(error.message || 'Failed to update goods');
                    console.error('Failed to update goods:', error);
                },
                onSuccess: () => {
                    onChange();
                }
            }),
            {
                loading: {
                    title: "Updating goods...",
                    description: "Please wait",
                },
                success: {
                    title: "Goods updated successfully!",
                    description: "The goods has been updated",
                },
                error: {
                    title: "Failed to update goods",
                    description: errorMessage || "Please try again"
                }
            }
        );
    }, [name, description, countAll, updateGoods, errorMessage]);

    const handleDelete = useCallback(() => {
        toaster.promise(
            deleteGoods({}, {
                onError: (error) => {
                    setErrorMessage(error.message || 'Failed to delete goods');
                    console.error('Failed to delete goods:', error);
                },
                onSuccess: () => {
                    goodsRefetch();
                }
            }),
            {
                loading: {
                    title: "Deleting goods...",
                    description: "Please wait",
                },
                success: {
                    title: "Goods deleted successfully!",
                    description: "The goods has been removed",
                },
                error: {
                    title: "Failed to delete goods",
                    description: errorMessage || "Please try again"
                }
            }
        )
    }, [deleteGoods, goodsRefetch]);

    return (
        <Dialog.Root placement={"center"}>
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
                                    <GoodsImageForm />
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
                                        <Button
                                            onClick={handleDelete}
                                            colorPalette={"red"}
                                        >
                                            Delete
                                        </Button>
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