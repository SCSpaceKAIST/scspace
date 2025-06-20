"use client"

import { Center, Heading, StackSeparator, VStack } from "@chakra-ui/react";
import { useAuth } from "@scspace-client/Hooks/auth";
import { useUserReservation } from "@scspace-client/Hooks/reservation";
import { useEffect, useState } from "react";

export default function UserReservation() {
    const { userInfo, needLogin } = useAuth();
    needLogin();

    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);

    const { userReservation, refetch } = useUserReservation({
        uid: userInfo?.id || 0,
        limit,
        offset: limit * (page - 1)
    });

    useEffect(() => { refetch(); }, [page, limit, userInfo?.id || 0]);

    useEffect(() => { console.log(userReservation) }, [userReservation]);

    return (
        <Center height="100%">
            <VStack separator={<StackSeparator />}>
                <VStack px={16}>
                    <Heading>
                        개발중
                    </Heading>
                </VStack>
                <VStack px={16}>
                    <Heading>
                        Under Development
                    </Heading>
                </VStack>
            </VStack>
        </Center>
    );
};
