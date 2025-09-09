import { IconButton } from "@chakra-ui/react";
import TooltipComponent from "@scspace-client/Components/atoms/Tooptip";
import { HiPlus } from "react-icons/hi";

export default function AddBtn({ onClick }: {
    onClick: () => void
}) {
    return (
        <TooltipComponent content="Add New">
            <IconButton
                rounded="sm"
                variant="ghost"
                onClick={onClick}
            >
                <HiPlus color="gray" />
            </IconButton>
        </TooltipComponent>
    );
}
