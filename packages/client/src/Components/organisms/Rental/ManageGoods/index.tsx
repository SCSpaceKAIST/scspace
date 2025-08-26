import { Stack } from "@chakra-ui/react";
import GoodsList from "../List";

export default function ManageGoods() {
    return (
        <Stack>
            <GoodsList
                manage
            />
        </Stack>
    );
}