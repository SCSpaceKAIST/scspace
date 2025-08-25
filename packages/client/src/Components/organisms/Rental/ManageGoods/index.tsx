import { Stack } from "@chakra-ui/react";
import GoodsList from "../List";
import { useState } from "react";

export default function ManageGoods() {
    const [checked, setChecked] = useState<{ [key: string]: boolean }>({});
    const handleCheck = (c: { id: number; checked: boolean }) => {
        if (!checked[c.id.toString()] && c.checked) {
            setChecked({ [c.id.toString()]: true });
        } else if (checked[c.id.toString()] && !c.checked) {
            setChecked({});
        }
    }

    return (
        <Stack>
            <GoodsList
                isAdmin
            />
        </Stack>
    );
}