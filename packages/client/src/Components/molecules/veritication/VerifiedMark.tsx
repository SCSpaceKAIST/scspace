import { Box } from "@chakra-ui/react";
import TooltipComponent from "@scspace-client/Components/atoms/Tooptip";
import {
    BsPatchCheckFill,
    BsPatchExclamation,
    BsPatchMinusFill
} from "react-icons/bs";

const size: number = 18;

export function Verified() {
    return (
        <TooltipComponent content="Verified">
            <Box width={"18px"} height={"18px"}>
                <BsPatchCheckFill size={size} color="blue" />
            </Box>
        </TooltipComponent>
    )
}

export function VerificationRequested() {
    return (
        <TooltipComponent content="Verification Under Riview">
            <Box width={"18px"} height={"18px"}>
                <BsPatchExclamation size={size} color="blue" />
            </Box>
        </TooltipComponent>
    )
}

export function Registered() {
    return (
        <TooltipComponent content="Verified">
            <Box width={"18px"} height={"18px"}>
                <BsPatchCheckFill size={size} color="green" />
            </Box>
        </TooltipComponent>
    )
}

export function RegistrationRequested() {
    return (
        <TooltipComponent content="Registration Under Review">
            <Box width={"18px"} height={"18px"}>
                <BsPatchExclamation size={size} color="green" />
            </Box>
        </TooltipComponent>
    )
}

export function Rejected() {
    return (
        <TooltipComponent content="Rejected">
            <Box width={"18px"} height={"18px"}>
                <BsPatchMinusFill size={size} color="red" />
            </Box>
        </TooltipComponent>
    )
}