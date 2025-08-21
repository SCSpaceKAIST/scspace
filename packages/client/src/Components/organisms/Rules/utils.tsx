import { Mark } from "@chakra-ui/react";

export function BlueMark({ children }: { children: string }) {
    return (
        <Mark
            whiteSpace={"break-spaces"}
            wordBreak={"break-all"}
            color={"blue"}
            fontWeight={"semibold"}
        >
            {children}
        </Mark>
    );
}

export function RedMark({ children }: { children: string }) {
    return (
        <Mark
            whiteSpace={"break-spaces"}
            wordBreak={"break-all"}
            color={"red"}
            fontWeight={"semibold"}
        >
            {children}
        </Mark>
    );
}