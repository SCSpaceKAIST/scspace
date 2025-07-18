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
            <BsPatchCheckFill size={size} color="blue" />
        </TooltipComponent>
    )
}

export function VerificationRequested() {
    return (
        <TooltipComponent content="Verification Under Riview">
            <BsPatchExclamation size={size} color="blue" />
        </TooltipComponent>
    )
}

export function Registered() {
    return (
        <TooltipComponent content="Verified">
            <BsPatchCheckFill size={size} color="green" />
        </TooltipComponent>
    )
}

export function RegistrationRequested() {
    return (
        <TooltipComponent content="Registration Under Review">
            <BsPatchExclamation size={size} color="green" />
        </TooltipComponent>
    )
}

export function Rejected() {
    return (
        <TooltipComponent content="Rejected">
            <BsPatchMinusFill size={size} color="red" />
        </TooltipComponent>
    )
}