import { IconButton } from "@chakra-ui/react";
import TooltipComponent from "@scspace-client/Components/atoms/Tooptip";
import { HiOutlineRefresh } from "react-icons/hi";

export default function RefetchBtn({ refetch }: { refetch: () => void }) {
    return (
        <TooltipComponent content="Refresh">
            <IconButton
                rounded="sm"
                variant="ghost"
                onClick={refetch}
            >
                <HiOutlineRefresh color="gray" />
            </IconButton>
        </TooltipComponent>
    );
}
