"use client"

import { Flex, Text, Field, HStack, } from "@chakra-ui/react";
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
            <Flex
                width="100%"
                justify="space-between"
            >
                <Text
                    margin={0}
                    padding={0}
                    fontSize="xl"
                    fontWeight="semibold"
                    width="fit-content"
                >
                    {user.nameKr}
                </Text>
                {showDeleteButton && (
                    <DeleteMemberBtn
                        onDelete={refetch}
                        disabled={deletable}
                        id={oid}
                        uid={user.id}
                    />
                )}
            </Flex>
            <Text>
                {user.studentNumber}
            </Text>
        </HStack>
    );
}