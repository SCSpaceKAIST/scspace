import { ConditionalValue, IconButton } from "@chakra-ui/react";
import TooltipComponent from "@scspace-client/Components/atoms/Tooptip";
import { HiOutlineRefresh } from "react-icons/hi";

export default function RefetchBtn({ refetch, size }: {
    refetch: () => void;
    size?: ConditionalValue<"md" | "sm" | "lg" | "xl" | "2xl" | "2xs" | "xs" | undefined>
}) {
    return (
        <TooltipComponent content="Refresh">
            <IconButton
                rounded="sm"
                variant="ghost"
                onClick={refetch}
                size={size ?? "md"}
            >
                <HiOutlineRefresh color="gray" />
            </IconButton>
        </TooltipComponent>
    );
}
