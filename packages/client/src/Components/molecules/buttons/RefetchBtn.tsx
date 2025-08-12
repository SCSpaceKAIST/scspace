import { IconButton } from "@chakra-ui/react";
import { HiOutlineRefresh } from "react-icons/hi";

export default function RefetchBtn({ refetch }: { refetch: () => void }) {
    return (
        <IconButton
            rounded="sm"
            variant="ghost"
            onClick={refetch}
        >
            <HiOutlineRefresh color="gray" />
        </IconButton>
    );
}
