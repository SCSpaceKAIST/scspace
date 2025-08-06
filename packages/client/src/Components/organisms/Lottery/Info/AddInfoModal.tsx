"use client"

import { Wrap } from "@chakra-ui/react";
import SimpleDialog from "@scspace-client/Components/atoms/SimpleDialog";
import { useLotteryInfoAPI } from "@scspace-client/Hooks/lottery";
import { Dispatch, SetStateAction } from "react";

export default function AddInfoModal({ open, setOpen }: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const { createLotteryInfo } = useLotteryInfoAPI();

    return (
        <SimpleDialog
            open={true}
            setOpen={() => { }}
        >
            <Wrap>
                1
            </Wrap>
        </SimpleDialog>
    );
}
