"use client"

import { Separator, VStack } from "@chakra-ui/react";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import HeroSection from "@scspace-client/Components/organisms/Home/HeroSection";
import ArticleSection from "@scspace-client/Components/organisms/Home/ArticleSection";
import SCSpaceSection from "@scspace-client/Components/organisms/Home/SCSpaceSection";
import LinkSection from "@scspace-client/Components/organisms/Home/LinkSection";
import ContactSection from "@scspace-client/Components/organisms/Home/ContactSection";

export default function HomeTemplate() {
    return (
        <Scroll>
            <VStack gap={0} align="stretch">
                <HeroSection />
                <SCSpaceSection />
                <ArticleSection />
                <LinkSection />
                <ContactSection />
            </VStack>
        </Scroll>
    );
}
