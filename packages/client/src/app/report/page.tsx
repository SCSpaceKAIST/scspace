import { Center, IconButton, Link, Text, VStack } from "@chakra-ui/react";
import PageTemplete from "@scspace-client/Components/templates/PageTemplete";
import Scroll from "@scspace-client/Components/templates/Scroll";
import { HiEnvelope } from "react-icons/hi2";

export default function SpacePage() {
    return (
        <PageTemplete
            title="오류 제보하기"
            subtitle="Reporting Error"
        >
            <Scroll>
                <Center height="100%">
                    <VStack>
                        <Text>
                            Please report an error by clicking the button below.
                        </Text>
                        <Text>
                            We will make sure SCSpace is always evolving.
                        </Text>
                        <Link href="https://docs.google.com/forms/d/e/1FAIpQLSekj_wQX_t06J8jJfZXWq-Okkr2e2K3mtajnT3dS3wKy7PEsA/viewform?usp=dialog" target="_blank">
                            <IconButton variant="outline" size="2xl">
                                <HiEnvelope />
                            </IconButton>
                        </Link>
                        <Text>
                            Thank You
                        </Text>
                    </VStack>
                </Center>
            </Scroll>
        </PageTemplete>
    );
}