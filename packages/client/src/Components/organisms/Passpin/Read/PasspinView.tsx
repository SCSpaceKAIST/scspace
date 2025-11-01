"use client"

import { Box, Button, Textarea } from "@chakra-ui/react";
import { PasspinHooks } from "@scspace-client/Hooks/passpin";

export default function PasspinView() {
    const { data: passpinData, refetch } = PasspinHooks.usePasspin();
    const { changePasspin } = PasspinHooks.usePasspinAPI();

    return (
        <Box>
            <Textarea
                autoresize
                value={JSON.stringify(passpinData, null, 2)}
                readOnly
            />
            <Button onClick={() => {
                changePasspin({ spaceId: 1 });
                refetch();
            }}>Create & Refetch</Button>
        </Box>
    );
};
