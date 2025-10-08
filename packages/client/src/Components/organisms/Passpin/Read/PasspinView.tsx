"use client"

import { usePasspinAPI } from "@scspace-client/Hooks/passpin";

export default function PasspinView() {
    const { data: passpinData, refetch } = usePasspinAPI().usePasspin();

    return (
        <div>
            <h1>Passpin View</h1>
            <pre>{JSON.stringify(passpinData, null, 2)}</pre>
        </div>
    );
};
