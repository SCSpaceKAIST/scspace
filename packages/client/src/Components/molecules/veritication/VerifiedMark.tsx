import TooltipComponent from "@scspace-client/Components/atoms/Tooptip";
import {
    BsPatchCheckFill,
    BsPatchExclamation,
    BsPatchMinusFill
} from "react-icons/bs";

export function Verified() {
    return (
        <TooltipComponent content="Verified">
            <BsPatchCheckFill size="20" color="blue" />
        </TooltipComponent>
    )
}

export function VerificationRequested() {
    return (
        <TooltipComponent content="Verification Under Riview">
            <BsPatchExclamation size="20" color="blue" />
        </TooltipComponent>
    )
}

export function Registered() {
    return (
        <TooltipComponent content="Verified">
            <BsPatchCheckFill size="20" color="green" />
        </TooltipComponent>
    )
}

export function RegistrationRequested() {
    return (
        <TooltipComponent content="Registration Under Review">
            <BsPatchExclamation size="20" color="green" />
        </TooltipComponent>
    )
}

export function Rejected() {
    return (
        <TooltipComponent content="Rejected">
            <BsPatchMinusFill size="20" color="red" />
        </TooltipComponent>
    )
}