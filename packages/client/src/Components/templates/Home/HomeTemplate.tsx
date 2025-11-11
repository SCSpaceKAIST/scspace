"use client"

import { VStack } from "@chakra-ui/react";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import FeatureSection from "@scspace-client/Components/organisms/Home/FeatureSection";
import HeroSection from "@scspace-client/Components/organisms/Home/HeroSection";
import ComingSoonSection from "@scspace-client/Components/organisms/Home/ComingSoonSection";
import SCSpaceSection from "@scspace-client/Components/organisms/Home/SCSpaceSection";
import VisionSection from "@scspace-client/Components/organisms/Home/VisionSection";
import { IRedirect } from "@scspace-client/Store/redirect";

interface HomeTemplateProps {
    redirectLinks: IRedirect[];
}

export default function HomeTemplate({ redirectLinks }: HomeTemplateProps) {
    return (
        <Scroll>
            <VStack gap={0} align="stretch">
                <HeroSection />
                <SCSpaceSection />
                <FeatureSection links={redirectLinks} />
                <ComingSoonSection />
                <VisionSection />
            </VStack>
        </Scroll>
    );
}
