import { ISuccessResponse } from "@scspace-depot/types/common/common.type";
import { useMutationApi } from "./api";
import { IMail } from "@scspace-depot/types/mail";

export function useMailAPI() {
    const sendMail = useMutationApi<ISuccessResponse, IMail>(
        "/mail/",
        "POST"
    ).mutate;

    return {
        sendMail
    };
}