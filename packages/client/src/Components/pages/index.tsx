"use client"

import HomeTemplate from "@scspace-client/Components/templates/Home/HomeTemplate";
import { useRedirectStore } from "@scspace-client/Store/redirect";

export default function HomePage() {
    const links = useRedirectStore((state) => state.links);

    return <HomeTemplate redirectLinks={links} />;
}
