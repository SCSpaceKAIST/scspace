"use client"

import { Text, HStack, VStack, } from "@chakra-ui/react";
import { IUser } from "@scspace-depot/types/user";

import DeleteMemberBtn from "./DeleteMemberBtn";
import React from "react";

export default function Member({ refetch, oid, user, deletable = false, showDeleteButton = true }: {
    refetch: () => any;
    oid: number;
    user: IUser;
    deletable?: boolean;
    showDeleteButton?: boolean;
}) {
    return (
        <HStack
            borderWidth="1px"
            rounded="sm"
            padding={2}
            width="fit-content"
            textAlign="center"
        >
            <VStack gap={1}>
                <Text
                    margin={0}
                    padding={0}
                    fontSize="xl"
                    fontWeight="semibold"
                    width="fit-content"
                >
                    {user.nameKr}
                </Text>
                <Text margin={0} padding={0} color="fg.muted" fontSize="xs">
                    {user.studentNumber}
                </Text>
            </VStack>
            {showDeleteButton && (
                <DeleteMemberBtn
                    onDelete={refetch}
                    disabled={deletable}
                    id={oid}
                    uid={user.id}
                />
            )}
        </HStack>
    );
}