"use client"

import PasspinView from "@scspace-client/Components/organisms/Passpin/Read/PasspinView";
import { useAuth } from "@scspace-client/Hooks/auth";

export default function PasspinPage() {
    const { needPasspinMaster } = useAuth();
    needPasspinMaster();

    return <PasspinView />;
}
