import TooltipComponent from "@scspace-client/Components/atoms/Tooptip";
import { VscVerifiedFilled, VscUnverified } from "react-icons/vsc";

export function Verified() {
    return (
        <TooltipComponent content="Verified">
            <VscVerifiedFilled size="25" color="blue" />
        </TooltipComponent>
    )
}

export function Unverified() {
    return (
        <TooltipComponent content="Under Reviewing">
            <VscUnverified size="25" color="green" />
        </TooltipComponent>
    )
}