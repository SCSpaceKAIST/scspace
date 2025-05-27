import { Center, Heading, StackSeparator, VStack } from "@chakra-ui/react";

export default function UserReservation() {
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
