import { Center, Heading, Spinner, VStack } from "@chakra-ui/react";

export default function LoadingComponent({ content }: { content?: string }) {
    return (
        <Center height="100%">
            <VStack
                gap={4}
            >
                <Spinner
                    size="xl"
                    borderWidth="4px"
                />
                <Heading margin={0} padding={0}>
                    {content ?? "Loading..."}
                </Heading>
            </VStack>
        </Center>
    );
}