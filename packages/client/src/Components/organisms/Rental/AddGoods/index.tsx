"use client"

import { Button, VStack } from "@chakra-ui/react";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import { GoodsNameForm } from "./NameForm";
import { useState, useCallback } from "react";
import { GoodsDescriptionForm } from "./DecsriptionForm";
import { GoodsCountForm } from "./CountForm";
import GoodsImageForm from "./ImageForm";
import { useGoodsAPI } from "@scspace-client/Hooks/rental";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import { IGoodsCreate } from "@scspace-depot/types/rental";

export function AddGoods() {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [countAll, setCountAll] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const createGoods = useGoodsAPI().createGoods;

    const handleSubmit = useCallback(() => {
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

    return (
        <Scroll>
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
                <Button onClick={handleSubmit}>
                    Add Goods
                </Button>
            </VStack>
        </Scroll>
    );
}