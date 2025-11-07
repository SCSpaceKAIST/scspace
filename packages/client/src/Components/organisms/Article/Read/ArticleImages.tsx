"use client"

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Center, HStack, IconButton, Text, useBreakpointValue } from "@chakra-ui/react";
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
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const [viewportWidth, setViewportWidth] = useState<number>(0);
    useEffect(() => {
        if (images.length === 0) {
            setSelect(0);
            return;
        }
        setSelect((prev) => {
            if (prev >= images.length) return images.length - 1;
            if (prev < 0) return 0;
            return prev;
        });
    }, [images.length]);
    useLayoutEffect(() => {
        const node = viewportRef.current;
        if (!node) return;
        const updateWidth = () => setViewportWidth(node.clientWidth);
        updateWidth();
        if (typeof ResizeObserver !== "undefined") {
            const observer = new ResizeObserver((entries) => {
                const entry = entries[0];
                if (entry) setViewportWidth(entry.contentRect.width);
            });
            observer.observe(node);
            return () => observer.disconnect();
        }
        const handleResize = () => setViewportWidth(node.clientWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Compute geometry for a centered carousel layout
    const slideGap = 4;
    const maxSlideWidth = 360;
    const baseHeight = 450;
    const aspectRatio = baseHeight / maxSlideWidth;
    const viewport = viewportWidth || maxSlideWidth;
    const slideWidth = Math.min(viewport, maxSlideWidth);
    const slideHeight = Math.round(slideWidth * aspectRatio);
    const totalSlideWidth = slideWidth + slideGap;
    const centerOffset = (viewport - slideWidth) / 2;
    const edgePadding = Math.max(centerOffset, 0);
    const translateX = -select * totalSlideWidth + dragDeltaX;
    const swipeClamp = totalSlideWidth;
    const swipeThreshold = Math.min(swipeClamp * 0.35, 120);

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.closest("button")) return;
        setDragStartX(e.clientX);
        setDragDeltaX(0);
        setIsDragging(true);
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { }
    }

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging || dragStartX === null) return;
        const raw = e.clientX - dragStartX;
        const clampValue = swipeClamp;
        const clamped = Math.max(-clampValue, Math.min(clampValue, raw));
        setDragDeltaX(clamped);
    }

    const finishDrag = (e?: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const delta = dragDeltaX;
        const threshold = swipeThreshold || 50;
        const currentSelect = select;
        let nextIndex = currentSelect;

        if (delta < -threshold && currentSelect < images.length - 1) {
            nextIndex = currentSelect + 1;
        } else if (delta > threshold && currentSelect > 0) {
            nextIndex = currentSelect - 1;
        } else {
            const clickThreshold = 8;
            if (Math.abs(delta) <= clickThreshold && e) {
                try {
                    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
                    let node = el;
                    while (node && node !== document.body) {
                        const idxAttr = node.getAttribute?.("data-idx");
                        if (idxAttr != null) {
                            const idx = parseInt(idxAttr, 10);
                            if (!Number.isNaN(idx)) nextIndex = idx;
                            break;
                        }
                        node = node.parentElement;
                    }
                } catch (err) {
                    // ignore tap fallbacks
                }
            }
        }

        setIsDragging(false);
        setDragStartX(null);
        setDragDeltaX(0);
        setSelect(nextIndex);
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

    if (images.length === 0) return null;

    return (
        <Center w="100%" maxW="100%" flexDirection="column" gap={4}>
            <Box
                ref={viewportRef}
                position="relative"
                w="100%"
                maxW="100%"
                overflow="hidden"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={finishDrag}
                onPointerCancel={finishDrag}
                style={{ touchAction: "pan-y" }}
                alignItems={"center"}
            >
                <HStack
                    alignItems="center"
                    style={{
                        transform: `translateX(${translateX}px)`,
                        transition: isDragging ? "none" : "transform 220ms ease",
                        gap: `${slideGap}px`,
                    }}
                    pl={`${edgePadding}px`}
                    pr={`${edgePadding}px`}
                >
                    {images.map((image, idx) => {
                        const isSelected = select === idx;
                        return (
                            <Center
                                key={`${image}-${idx}`}
                                data-idx={`${idx}`}
                                w={`${slideWidth}px`}
                                h={`${slideHeight}px`}
                                flexShrink={0}
                                justifyContent="center"
                                alignItems="center"
                                background="gray.200"
                                position="relative"
                                borderRadius="md"
                                overflow="hidden"
                                transform={isSelected ? "scale(1)" : "scale(0.9)"}
                                transition="transform 180ms ease"
                            >
                                <Image
                                    src={image ? `${localhostBaseURL}${image}` : "/img/logo.svg"}
                                    alt={`Image ${idx + 1}`}
                                    layout="fill"
                                    objectFit="contain"
                                />
                                {editable && (
                                    <>
                                        <Box position="absolute" top={2} right={2}>
                                            <IconButton
                                                size="xs"
                                                variant="ghost"
                                                onClick={() => deleteImage(idx)}
                                            >
                                                <HiX />
                                            </IconButton>
                                        </Box>
                                        <Box
                                            position="absolute"
                                            bottom={2}
                                            display={isSelected ? "block" : "none"}
                                        >
                                            <HStack
                                                backdropFilter="blur(8px)"
                                                background="rgba(255,255,255,0.3)"
                                                rounded="md"
                                            >
                                                <IconButton
                                                    size="xs"
                                                    variant="ghost"
                                                    disabled={idx === 0}
                                                    onClick={async () => {
                                                        exchangeImages(idx, idx - 1).then(() => {
                                                            setSelect(Math.max(idx - 1, 0));
                                                            setDragDeltaX(0);
                                                        });
                                                    }}
                                                >
                                                    <HiMinus />
                                                </IconButton>
                                                <Text fontWeight="semibold">{idx + 1}</Text>
                                                <IconButton
                                                    size="xs"
                                                    variant="ghost"
                                                    disabled={idx === images.length - 1}
                                                    onClick={async () => {
                                                        exchangeImages(idx, idx + 1).then(() => {
                                                            setSelect(Math.min(idx + 1, images.length - 1));
                                                            setDragDeltaX(0);
                                                        });
                                                    }}
                                                >
                                                    <HiPlus />
                                                </IconButton>
                                            </HStack>
                                        </Box>
                                    </>
                                )}
                            </Center>
                        );
                    })}
                </HStack>
            </Box>
            <Box display="flex" justifyContent="center" w="100%">
                <HStack gap={2}>
                    {images.map((_, i) => (
                        <Box
                            key={`dot-${i}`}
                            as="button"
                            onClick={() => {
                                setSelect(i);
                                setDragDeltaX(0);
                                setIsDragging(false);
                            }}
                            w={2}
                            h={2}
                            bg={i === select ? "gray.700" : "gray.400"}
                            borderRadius="full"
                            transition="all 120ms"
                        />
                    ))}
                </HStack>
            </Box>
        </Center>
    );
}