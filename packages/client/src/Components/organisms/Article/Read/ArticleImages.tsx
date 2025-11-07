"use client"

import React, { useEffect, useState } from "react";
import { Box, Center, HStack, IconButton, Text } from "@chakra-ui/react";
import Image from "next/image";
import { HiMinus, HiPlus, HiX } from "react-icons/hi";

const localhostBaseURL = "http://localhost:3001/uploads/";

export default function ArticleImages({ editable, images, setImages }: {
    editable: boolean;
    images: string[];
    setImages: (images: string[]) => void;
}) {
    const [select, setSelect] = useState<number>(0);
    // drag/swipe state
    const [dragStartX, setDragStartX] = useState<number | null>(null);
    const [dragDeltaX, setDragDeltaX] = useState<number>(0);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    useEffect(() => {
        if (select >= images.length) {
            setSelect(images.length - 1);
        } else {
            setSelect(0);
        }
    }, [images.length]);

    if (images.length === 0) return null;

    // pointer event handlers for swipe
    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        // start drag
        setDragStartX(e.clientX);
        setIsDragging(true);
        // capture the pointer so we continue receiving events
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { }
    }

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging || dragStartX === null) return;
        const raw = e.clientX - dragStartX;
        // clamp to one slide distance so user can't drag past next slide
        const slideClamp = 248; // approximate slide step used in layout
        const clamped = Math.max(-slideClamp, Math.min(slideClamp, raw));
        setDragDeltaX(clamped);
    }

    const finishDrag = (e?: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const delta = dragDeltaX;
        const threshold = 50; // px to qualify as a swipe
        // only move by one slide regardless of how far user dragged
        if (delta < -threshold && select < images.length - 1) {
            setSelect((s) => s + 1);
        } else if (delta > threshold && select > 0) {
            setSelect((s) => s - 1);
        } else {
            // if no substantial drag, treat as click/tap if pointer is over an image
            const clickThreshold = 8; // px
            if (Math.abs(delta) <= clickThreshold && e) {
                try {
                    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
                    let node = el;
                    while (node && node !== document.body) {
                        const idxAttr = node.getAttribute?.('data-idx');
                        if (idxAttr != null) {
                            const idx = parseInt(idxAttr, 10);
                            if (!Number.isNaN(idx)) setSelect(idx);
                            break;
                        }
                        node = node.parentElement;
                    }
                } catch (err) {
                    // ignore
                }
            }
        }
        setIsDragging(false);
        setDragDeltaX(0);
        setDragStartX(null);
        try { if (e) e.currentTarget.releasePointerCapture(e.pointerId); } catch (err) { }
    }


    const exchangeImages = async (from: number, to: number) => {
        if (from < 0 || from >= images.length || to < 0 || to >= images.length) return;
        const newImages = [...images];
        const temp = newImages[from];
        newImages[from] = newImages[to];
        newImages[to] = temp;

        setImages(newImages);
    }

    const deleteImage = (index: number) => {
        if (index < 0 || index >= images.length) return;
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    }

    return (
        <Center
            overflow={"hidden"}
            minH={0}
            w="100%" maxW="100%"
            whiteSpace="nowrap"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
            // allow vertical scrolling while we handle horizontal drag
            style={{ touchAction: 'pan-y' }}
        >
            <Box display={"flex"} flexDirection={"column"} alignItems={"center"} w="100%">
                <HStack
                    w="fit-content" minW="max-content"
                    h={"450px"} maxH={"96svw"}
                    style={{
                        transform: isDragging ? `translateX(${dragDeltaX}px)` : undefined,
                        transition: isDragging ? 'none' : 'transform 220ms ease',
                    }}
                >
                    <Box
                        key={`empty-before`}
                        w={`${248 * (images.length - select - 1) + 8}px`}
                        // h={'100px'}
                        transition={"all"}
                        transitionDuration={"moderate"}
                    // background={"gray.200"}
                    />
                    {images.map((image, idx) => (
                        <Center
                            w={(select === idx ? "360px" : "240px")}
                            h={(select === idx ? "450px" : "300px")}
                            maxW={"72svw"}
                            maxH={"96svw"}
                            key={`${image}-${idx}`}
                            data-idx={`${idx}`}
                            justifyContent={"center"}
                            alignContent={"center"}
                            // selection handled on pointerup to distinguish drag vs click/tap
                            transition={"all"}
                            transitionDuration={"moderate"}
                            // background={(select !== idx ? "gray.200" : "transparent")}
                            background={"gray.200"}
                            position={"relative"}
                        >
                            <Image
                                src={image ? `${localhostBaseURL}${image}` : "/img/logo.svg"}
                                alt={`Image ${idx + 1}`}
                                layout="fill"
                                objectFit="contain"
                            />
                            {editable && (<>
                                <Box position={"absolute"} top={2} right={2}>
                                    <IconButton
                                        size={"xs"}
                                        variant={"ghost"}
                                        onClick={() => deleteImage(idx)}
                                    >
                                        <HiX />
                                    </IconButton>
                                </Box>
                                <Box position={"absolute"} bottom={2}
                                    display={(idx === select) ? "block" : "none"}
                                >
                                    <HStack
                                        backdropFilter="blur(8px)"
                                        background="rgba(255,255,255,0.3)"
                                        rounded={"md"}
                                    >
                                        <IconButton
                                            size={"xs"}
                                            variant={"ghost"}
                                            disabled={idx === 0}
                                            onClick={async () => {
                                                exchangeImages(idx, idx - 1).then(() => {
                                                    setSelect(idx - 1);
                                                });
                                            }}
                                        >
                                            <HiMinus />
                                        </IconButton>
                                        <Text fontWeight={"semibold"}>
                                            {idx + 1}
                                        </Text>
                                        <IconButton
                                            size={"xs"}
                                            variant={"ghost"}
                                            disabled={idx === images.length - 1}
                                            onClick={async () => {
                                                exchangeImages(idx, idx + 1).then(() => {
                                                    setSelect(idx + 1);
                                                });
                                            }}
                                        >
                                            <HiPlus />
                                        </IconButton>
                                    </HStack>
                                </Box>
                            </>)}
                        </Center>
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
                {/* pagination dots */}
                <Box mt={3} display={"flex"} justifyContent={"center"} w="100%">
                    <HStack gap={2}>
                        {images.map((_, i) => (
                            <Box
                                key={`dot-${i}`}
                                as={"button"}
                                onClick={() => setSelect(i)}
                                w={2}
                                h={2}
                                bg={i === select ? "gray.700" : "gray.400"}
                                borderRadius="full"
                                transition="all 120ms"
                            />
                        ))}
                    </HStack>
                </Box>
            </Box>
        </Center>
    );
}